import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, TicketFilterDto, AddTicketNoteDto, CloseTicketDto } from './tickets.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Create new ticket' })
  async create(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(req.user.tenantId, req.user.id, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get all tickets' })
  async findAll(@Req() req: any, @Query() filter: TicketFilterDto) {
    return this.ticketsService.findAll(req.user.tenantId, filter);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get ticket statistics' })
  async getStats(@Req() req: any) {
    return this.ticketsService.getStats(req.user.tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.ticketsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Update ticket' })
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(req.user.tenantId, id, dto);
  }

  @Post(':id/assign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Assign ticket to agent' })
  async assign(@Req() req: any, @Param('id') id: string, @Body() body: { agentId: string }) {
    return this.ticketsService.assign(req.user.tenantId, id, body.agentId);
  }

  @Post(':id/notes')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Add note to ticket' })
  async addNote(@Req() req: any, @Param('id') id: string, @Body() dto: AddTicketNoteDto) {
    return this.ticketsService.addNote(req.user.tenantId, req.user.id, id, dto);
  }

  @Post(':id/resolve')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Resolve ticket' })
  async resolve(@Req() req: any, @Param('id') id: string) {
    return this.ticketsService.resolve(req.user.tenantId, id);
  }

  @Post(':id/close')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Close ticket' })
  async close(@Req() req: any, @Param('id') id: string, @Body() dto: CloseTicketDto) {
    return this.ticketsService.close(req.user.tenantId, id, dto);
  }
}