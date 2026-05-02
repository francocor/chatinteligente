import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertRuleDto, UpdateAlertRuleDto, AlertFilterDto, CreateAlertDto, ProcessAlertDto } from './alerts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Create alert manually' })
  async create(@Req() req: any, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(req.user.tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get all alerts' })
  async findAll(@Req() req: any, @Query() filter: AlertFilterDto) {
    return this.alertsService.findAll(req.user.tenantId, filter);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get alert statistics' })
  async getStats(@Req() req: any) {
    return this.alertsService.getStats(req.user.tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get alert by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.alertsService.findOne(req.user.tenantId, id);
  }

  @Post(':id/process')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Process alert (acknowledge/resolve/dismiss)' })
  async process(@Req() req: any, @Param('id') id: string, @Body() dto: ProcessAlertDto) {
    return this.alertsService.process(req.user.tenantId, req.user.id, id, dto);
  }

  @Post('rules')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create alert rule' })
  async createRule(@Req() req: any, @Body() dto: CreateAlertRuleDto) {
    return this.alertsService.createRule(req.user.tenantId, req.user.id, dto);
  }

  @Get('rules')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get all alert rules' })
  async findAllRules(@Req() req: any) {
    return this.alertsService.findAllRules(req.user.tenantId);
  }

  @Put('rules/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update alert rule' })
  async updateRule(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateAlertRuleDto) {
    return this.alertsService.updateRule(req.user.tenantId, id, dto);
  }
}