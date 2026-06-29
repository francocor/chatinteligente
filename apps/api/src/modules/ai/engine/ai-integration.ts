import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  provider?: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter' | 'null';
}

/**
 * A single LLM provider in the fallback chain. Every provider speaks the
 * OpenAI-compatible `/chat/completions` dialect, so one request implementation
 * covers Gemini, Groq, OpenRouter, OpenAI, etc. — only baseUrl/apiKey/model change.
 */
interface ProviderConfig {
  id: string;
  label: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface ProviderDefaults {
  id: string;
  label: string;
  baseUrlEnv: string;
  baseUrlDefault: string;
  apiKeyEnv: string;
  modelEnv: string;
  modelDefault: string;
}

/**
 * Built-in providers with sensible free-tier defaults. A provider only joins
 * the chain when its API key is present in the environment.
 */
const PROVIDER_CATALOG: Record<string, ProviderDefaults> = {
  gemini: {
    id: 'gemini',
    label: 'Google Gemini',
    baseUrlEnv: 'GEMINI_BASE_URL',
    baseUrlDefault: 'https://generativelanguage.googleapis.com/v1beta/openai',
    apiKeyEnv: 'GEMINI_API_KEY',
    modelEnv: 'GEMINI_MODEL',
    modelDefault: 'gemini-2.0-flash',
  },
  groq: {
    id: 'groq',
    label: 'Groq',
    baseUrlEnv: 'GROQ_BASE_URL',
    baseUrlDefault: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    modelEnv: 'GROQ_MODEL',
    modelDefault: 'llama-3.3-70b-versatile',
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrlEnv: 'OPENROUTER_BASE_URL',
    baseUrlDefault: 'https://openrouter.ai/api/v1',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    modelEnv: 'OPENROUTER_MODEL',
    modelDefault: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    baseUrlEnv: 'OPENAI_BASE_URL',
    baseUrlDefault: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    modelDefault: 'gpt-4o-mini',
  },
};

const DEFAULT_CHAIN = ['gemini', 'groq', 'openrouter', 'openai'];

@Injectable()
export class AIIntegration {
  private readonly logger = new Logger(AIIntegration.name);
  private readonly providers: ProviderConfig[];
  private readonly temperature: number;
  private readonly maxTokens: number;
  private readonly timeoutMs: number;
  private readonly systemPrompt: string;

  constructor(private configService: ConfigService) {
    this.temperature = Number(this.configService.get('AI_TEMPERATURE') ?? 0.7);
    this.maxTokens = Number(this.configService.get('AI_MAX_TOKENS') ?? 500);
    this.timeoutMs = Number(this.configService.get('AI_TIMEOUT_MS') ?? 15000);
    this.systemPrompt =
      this.configService.get('AI_SYSTEM_PROMPT') || this.getDefaultSystemPrompt();
    this.providers = this.buildChain();

    if (this.providers.length === 0) {
      this.logger.warn(
        'No AI providers configured — every request will use the mock fallback. Set GEMINI_API_KEY or GROQ_API_KEY to enable real responses.',
      );
    } else {
      this.logger.log(
        `AI fallback chain: ${this.providers.map((p) => p.label).join(' -> ')} -> mock`,
      );
    }
  }

  /** Whether at least one real provider is configured. */
  get isEnabled(): boolean {
    return this.providers.length > 0;
  }

  /**
   * Generate a response, walking the provider chain until one succeeds.
   * On any failure (timeout, 429, 5xx, network, empty body) it fails over to
   * the next provider. If every real provider fails it returns a mock response,
   * so this method never throws and the bot is never left mute.
   */
  async generateResponse(
    userMessage: string,
    context: {
      conversationHistory?: ChatMessage[];
      systemPrompt?: string;
      knowledgeContext?: string;
    } = {},
  ): Promise<AIResponse> {
    const messages = this.buildMessages(userMessage, context);

    for (const provider of this.providers) {
      try {
        const response = await this.makeRequest(provider, messages);
        if (response.message && response.message.trim().length > 0) {
          return response;
        }
        this.logger.warn(`${provider.label} returned an empty response — failing over.`);
      } catch (error) {
        this.logger.warn(
          `${provider.label} failed (${this.describeError(error)}) — failing over to next provider.`,
        );
      }
    }

    return this.getMockResponse();
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Embeddings need a provider that exposes /embeddings (OpenAI/Gemini).
    // Vector search is not wired yet, so return an empty vector gracefully.
    const provider = this.providers.find((p) => p.id === 'openai' || p.id === 'gemini');
    if (!provider) {
      return [];
    }

    try {
      const response = await this.fetchWithTimeout(`${provider.baseUrl}/embeddings`, {
        method: 'POST',
        headers: this.buildHeaders(provider),
        body: JSON.stringify({
          model: this.configService.get('AI_EMBEDDING_MODEL') || 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.[0]?.embedding ?? [];
    } catch (error) {
      this.logger.error(`Embedding error: ${this.describeError(error)}`);
      return [];
    }
  }

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }> {
    const systemPrompt = `
Eres un analizador de sentimiento. Analiza el siguiente texto y responde solo con un objeto JSON.
Ejemplo: {"sentiment": "neutral", "score": 0.5}

Considera:
- Positivo: gracias, excelente, genial, feliz, satisfecho, encantado
- Negativo: error, problema, frustrado, enojado, terrible, peor, nunca
- Neutral: preguntas simples, información factual

Responde con JSON solo.
    `.trim();

    try {
      const response = await this.generateResponse(text, { systemPrompt });
      const result = JSON.parse(this.extractJson(response.message));
      return {
        sentiment: result.sentiment || 'neutral',
        score: typeof result.score === 'number' ? result.score : 0.5,
      };
    } catch {
      return { sentiment: 'neutral', score: 0.5 };
    }
  }

  async extractEntities(text: string): Promise<Record<string, string>> {
    const systemPrompt = `
Extrae entidades del siguiente texto y responde solo con JSON.
Ejemplo para "Mi documento es 12.345.678 y soy de Córdoba":
{"documento": "12.345.678", "ciudad": "Córdoba"}

Busca: documento/ID, teléfono, email, nombre, fecha, lugar.
Responde solo con JSON.
    `.trim();

    try {
      const response = await this.generateResponse(text, { systemPrompt });
      return JSON.parse(this.extractJson(response.message));
    } catch {
      return {};
    }
  }

  async summarizeConversation(
    messages: { role: string; content: string }[],
  ): Promise<string> {
    const systemPrompt = `
Resume esta conversación en 2-3 oraciones.
Incluye: tema principal, información clave intercambiada, estado actual.
    `.trim();

    const conversationText = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    try {
      const response = await this.generateResponse(conversationText, { systemPrompt });
      return response.message;
    } catch {
      return 'No se pudo generar el resumen.';
    }
  }

  checkStatus(): {
    enabled: boolean;
    providers: { id: string; label: string; model: string }[];
    chain: string;
  } {
    return {
      enabled: this.isEnabled,
      providers: this.providers.map((p) => ({
        id: p.id,
        label: p.label,
        model: p.model,
      })),
      chain: [...this.providers.map((p) => p.label), 'mock'].join(' -> '),
    };
  }

  // --- internals -----------------------------------------------------------

  private buildChain(): ProviderConfig[] {
    const order = (this.configService.get<string>('AI_PROVIDER_CHAIN') || DEFAULT_CHAIN.join(','))
      .split(',')
      .map((id) => id.trim().toLowerCase())
      .filter(Boolean);

    const chain: ProviderConfig[] = [];

    for (const id of order) {
      const def = PROVIDER_CATALOG[id];
      if (!def) {
        this.logger.warn(`Unknown AI provider "${id}" in AI_PROVIDER_CHAIN — skipping.`);
        continue;
      }

      const apiKey = this.configService.get<string>(def.apiKeyEnv);
      if (!apiKey) {
        continue;
      }

      chain.push({
        id: def.id,
        label: def.label,
        apiKey,
        baseUrl: this.configService.get<string>(def.baseUrlEnv) || def.baseUrlDefault,
        model: this.configService.get<string>(def.modelEnv) || def.modelDefault,
      });
    }

    return chain;
  }

  private buildMessages(
    userMessage: string,
    context: {
      conversationHistory?: ChatMessage[];
      systemPrompt?: string;
      knowledgeContext?: string;
    },
  ): ChatMessage[] {
    const messages: ChatMessage[] = [
      { role: 'system', content: context.systemPrompt || this.systemPrompt },
    ];

    if (context.knowledgeContext) {
      messages.push({
        role: 'system',
        content: `Información relevante:\n${context.knowledgeContext}`,
      });
    }

    if (context.conversationHistory) {
      messages.push(...context.conversationHistory.slice(-10));
    }

    messages.push({ role: 'user', content: userMessage });
    return messages;
  }

  private async makeRequest(
    provider: ProviderConfig,
    messages: ChatMessage[],
  ): Promise<AIResponse> {
    const response = await this.fetchWithTimeout(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.buildHeaders(provider),
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status} ${body.slice(0, 200)}`);
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content ?? '';

    return {
      message,
      provider: provider.id,
      model: provider.model,
      usage: data?.usage,
      finishReason: data?.choices?.[0]?.finish_reason,
    };
  }

  private buildHeaders(provider: ProviderConfig): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.apiKey}`,
    };
  }

  private async fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  /** Pulls the first JSON object/array out of a model reply (handles ```json fences). */
  private extractJson(text: string): string {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return match ? match[0] : text;
  }

  private describeError(error: unknown): string {
    if (error instanceof Error) {
      return error.name === 'AbortError' ? `timeout after ${this.timeoutMs}ms` : error.message;
    }
    return String(error);
  }

  private getDefaultSystemPrompt(): string {
    return `
Eres un asistente virtual de atención al cliente.
Tu objetivo es ayudar a los clientes de manera amable, clara y eficiente.

Directrices:
1. Saluda con cordialidad cuando el usuario te salude
2. Usa el nombre del usuario si lo conoces
3. Proporciona información clara y concisa
4. Cuando no entiendas, pregunta para aclarar
5. Ofrece derivar a una persona del equipo si no puedes resolver la consulta
6. Mantén un tono profesional y empático
7. No inventes datos: si no tenés la información, decilo y ofrecé ayuda humana
    `.trim();
  }

  private getMockResponse(): AIResponse {
    return {
      message:
        'Gracias por tu mensaje. En este momento no puedo procesar la consulta automáticamente. ¿Querés que te derive con una persona de nuestro equipo?',
      provider: 'mock',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }
}
