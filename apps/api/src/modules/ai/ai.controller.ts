import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AIService } from './ai.service';
import { ClassifyDto, GenerateDto, SearchKnowledgeDto } from './ai.dto';
import { ProcessMessageDto, GenerateAIDto, SentimentDto, EntitiesDto } from './ai-chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatEngine } from './engine/chat-engine';
import { AIIntegration } from './engine/ai-integration';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIController {
  constructor(
    private aiService: AIService,
    private chatEngine: ChatEngine,
    private aiIntegration: AIIntegration,
  ) {}

  @Post('classify')
  @ApiOperation({ summary: 'Classify user intent from message' })
  async classify(@Req() req: any, @Body() dto: ClassifyDto) {
    return this.aiService.classifyIntent(req.user.tenantId, dto.text);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate AI response' })
  async generate(@Req() req: any, @Body() dto: GenerateDto) {
    return { response: await this.aiService.generateResponse(req.user.tenantId, dto.intent, dto.context) };
  }

  @Post('knowledge/search')
  @ApiOperation({ summary: 'Search knowledge base' })
  async searchKnowledge(@Req() req: any, @Body() dto: SearchKnowledgeDto) {
    return this.aiService.searchKnowledge(req.user.tenantId, dto.query);
  }

  @Post('chat/process')
  @ApiOperation({ summary: 'Process a chat message using Hybrid Engine' })
  async processMessage(@Req() req: any, @Body() dto: ProcessMessageDto) {
    return this.chatEngine.processMessage(
      req.user.tenantId,
      dto.conversationId,
      dto.contactId,
      dto.message,
    );
  }

  @Post('chat/offer-human')
  @ApiOperation({ summary: 'Offer human handoff' })
  async offerHuman(@Body() dto: { conversationId: string }) {
    return this.chatEngine.offerHuman(dto.conversationId);
  }

  @Post('chat/end')
  @ApiOperation({ summary: 'End conversation and save context' })
  async endConversation(@Body() dto: { conversationId: string }) {
    await this.chatEngine.endConversation(dto.conversationId);
    return { success: true };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get AI service status' })
  async getStatus() {
    return this.aiIntegration.checkStatus();
  }

  @Post('ai/generate')
  @ApiOperation({ summary: 'Generate AI response using OpenAI' })
  async generateAI(@Body() dto: GenerateAIDto) {
    return this.aiIntegration.generateResponse(dto.message, dto.context);
  }

  @Post('ai/sentiment')
  @ApiOperation({ summary: 'Analyze sentiment using AI' })
  async analyzeSentiment(@Body() dto: SentimentDto) {
    return this.aiIntegration.analyzeSentiment(dto.text);
  }

  @Post('ai/entities')
  @ApiOperation({ summary: 'Extract entities using AI' })
  async extractEntities(@Body() dto: EntitiesDto) {
    return this.aiIntegration.extractEntities(dto.text);
  }
}