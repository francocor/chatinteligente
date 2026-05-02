import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto, AgentStatusDto } from './agents.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('agents')
@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create new agent' })
  async create(@Req() req: any, @Body() dto: CreateAgentDto) {
    return this.agentsService.create(req.user.tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get all agents' })
  async findAll(@Req() req: any) {
    return this.agentsService.findAll(req.user.tenantId);
  }

  @Get('available')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get available agents' })
  async findAvailable(@Req() req: any) {
    return this.agentsService.findAvailable(req.user.tenantId);
  }

  @Get('queue')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get conversation queue' })
  async getQueue(@Req() req: any, @Query('queueId') queueId?: string) {
    return this.agentsService.getQueue(req.user.tenantId, queueId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get agent by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.agentsService.findOne(req.user.tenantId, id);
  }

  @Put(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Update agent status' })
  async updateStatus(@Req() req: any, @Param('id') id: string, @Body() dto: AgentStatusDto) {
    return this.agentsService.updateStatus(req.user.tenantId, id, dto);
  }
}