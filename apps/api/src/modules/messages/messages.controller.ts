import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './messages.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('messages')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('conversations/:conversationId/messages')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Create message in conversation' })
  async create(@Param('conversationId') conversationId: string, @Body() dto: CreateMessageDto) {
    return this.messagesService.create(conversationId, dto);
  }

  @Get('conversations/:conversationId/messages')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get messages by conversation' })
  async findByConversation(@Param('conversationId') conversationId: string) {
    return this.messagesService.findByConversation(conversationId);
  }
}