import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OpenAIConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter' | 'null';
}

@Injectable()
export class AIIntegration {
  private readonly logger = new Logger(AIIntegration.name);
  private config: OpenAIConfig;
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get('OPENAI_API_KEY'),
      baseUrl: this.configService.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1',
      model: this.configService.get('OPENAI_MODEL') || 'gpt-4',
      temperature: 0.7,
      maxTokens: 500,
    };

    this.isEnabled = !!this.config.apiKey;
  }

  async generateResponse(
    userMessage: string,
    context: {
      conversationHistory?: ChatMessage[];
      systemPrompt?: string;
      knowledgeContext?: string;
    } = {},
  ): Promise<AIResponse> {
    if (!this.isEnabled) {
      return this.getDisabledResponse();
    }

    const messages: ChatMessage[] = [];

    if (context.systemPrompt) {
      messages.push({
        role: 'system',
        content: context.systemPrompt,
      });
    } else {
      messages.push({
        role: 'system',
        content: this.getDefaultSystemPrompt(),
      });
    }

    if (context.knowledgeContext) {
      messages.push({
        role: 'system',
        content: `Información relevante:\n${context.knowledgeContext}`,
      });
    }

    if (context.conversationHistory) {
      messages.push(...context.conversationHistory.slice(-10));
    }

    messages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await this.makeRequest(messages);
      return response;
    } catch (error) {
      this.logger.error(`OpenAI API error: ${error.message}`);
      throw new HttpException(
        'Error generating AI response',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isEnabled) {
      return [];
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      this.logger.error(`Embedding error: ${error.message}`);
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
- Positivo: gracias, excelente, genial, amor, feliz, satisfecho, encantado
- Negativo: error, problema, frustrado, enojado, terrible, peor, nunca
- Neutral: preguntas simples, información factual

Responde con JSON solo.
    `.trim();

    try {
      const response = await this.generateResponse(text, { systemPrompt });
      
      const result = JSON.parse(response.message);
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0.5,
      };
    } catch {
      return { sentiment: 'neutral', score: 0.5 };
    }
  }

  async extractEntities(text: string): Promise<Record<string, string>> {
    const systemPrompt = `
Extrae entidades del siguiente texto.
Ejemplo para "Mi rut es 12.345.678-9 y soy de Santiago":
{"rut": "12.345.678-9", "ciudad": "Santiago"}

Busca: RUT, teléfono, email, nombre, fecha, lugar.
Responde solo con JSON.
    `.trim();

    try {
      const response = await this.generateResponse(text, { systemPrompt });
      return JSON.parse(response.message);
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
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    try {
      const response = await this.generateResponse(conversationText, {
        systemPrompt,
      });
      return response.message;
    } catch {
      return 'No se pudo generar el resumen.';
    }
  }

  private async makeRequest(messages: ChatMessage[]): Promise<AIResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    
    return {
      message: data.choices[0].message.content,
      usage: data.usage,
      finishReason: data.choices[0].finish_reason,
    };
  }

  private getDefaultSystemPrompt(): string {
    return `
Eres un asistente virtual de atención al cliente para una clínica médica.
Tu objetivo es ayudar a los pacientes de manera amigable y eficiente.

Directrices:
1. Saluda con entusiasmo cuando el usuario te salude
2. Usa el nombre del usuario si lo conoces
3. Proporciona información clara y concisa
4. Cuando no entiendas, pregunta para aclarar
5. Ofrece hablar con una persona si no puedes ayudar
6. Usa emojis ocasionalmente para hacer la conversación más cálida
7. Sé empático con pacientes nerviosos o preocupados
8. No des diagnósticos médicos
9. Para urgencias, derivado inmediatamente a un humano

Información de la clínica:
- Horarios: Lunes a Viernes 08:00-20:00, Sábados 08:00-14:00
- Turnos: Disponibles con 24-48 horas de anticipación
- Resultados: Disponibles 24-72 horas después del estudio
    `.trim();
  }

  private getDisabledResponse(): AIResponse {
    return {
      message: 'Lo siento, el asistente IA no está disponible en este momento.',
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    };
  }

  checkStatus(): { enabled: boolean; provider: string; model: string } {
    return {
      enabled: this.isEnabled,
      provider: 'openai',
      model: this.config.model || 'gpt-4',
    };
  }
}