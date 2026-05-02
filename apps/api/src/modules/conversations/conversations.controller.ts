import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { 
  CreateConversationDto, 
  UpdateConversationDto, 
  ConversationFilterDto,
  AssignConversationDto,
  EscalateConversationDto,
  AddNoteDto,
  SendMessageDto,
  CloseConversationDto
} from './conversations.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('conversations')
@Controller('conversations')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Create new conversation' })
  async create(@Req() req: any, @Body() dto: CreateConversationDto) {
    return this.conversationsService.create(req.user.tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get all conversations' })
  async findAll(@Req() req: any, @Query() filter: ConversationFilterDto) {
    return this.conversationsService.findAll(req.user.tenantId, filter);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get conversation statistics' })
  async getStats(@Req() req: any) {
    return this.conversationsService.getStats(req.user.tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get conversation by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.conversationsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Update conversation' })
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateConversationDto) {
    return this.conversationsService.update(req.user.tenantId, id, dto);
  }

  @Post(':id/assign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Assign conversation to agent' })
  async assign(@Req() req: any, @Param('id') id: string, @Body() dto: AssignConversationDto) {
    return this.conversationsService.assign(req.user.tenantId, id, dto);
  }

  @Post(':id/transfer')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Transfer conversation to agent' })
  async transfer(@Req() req: any, @Param('id') id: string, @Body() dto: AssignConversationDto) {
    return this.conversationsService.transfer(req.user.tenantId, id, dto);
  }

  @Post(':id/escalate')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Escalate conversation to supervisor' })
  async escalate(@Req() req: any, @Param('id') id: string, @Body() dto: EscalateConversationDto) {
    return this.conversationsService.escalate(req.user.tenantId, id, req.user.id, dto);
  }

  @Post(':id/notes')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Add internal note to conversation' })
  async addNote(@Req() req: any, @Param('id') id: string, @Body() dto: AddNoteDto) {
    return this.conversationsService.addNote(req.user.tenantId, id, req.user.id, dto);
  }

  @Post(':id/messages')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Send message in conversation' })
  async sendMessage(@Req() req: any, @Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.conversationsService.sendMessage(req.user.tenantId, req.user.id, id, dto);
  }

  @Post(':id/resolve')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Resolve conversation' })
  async resolve(@Req() req: any, @Param('id') id: string) {
    return this.conversationsService.resolve(req.user.tenantId, id);
  }

  @Post(':id/close')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Close conversation' })
  async close(@Req() req: any, @Param('id') id: string, @Body() dto: CloseConversationDto) {
    return this.conversationsService.close(req.user.tenantId, id, dto);
  }
}