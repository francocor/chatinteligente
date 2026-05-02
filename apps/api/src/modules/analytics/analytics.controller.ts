import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsFilterDto, DateRangeDto, ExportReportDto } from './analytics.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get analytics overview' })
  async getOverview(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getOverview(req.user.tenantId, filter);
  }

  @Get('messages')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get message metrics' })
  async getMessagesMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getMessagesMetrics(req.user.tenantId, filter);
  }

  @Get('ai')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get AI metrics' })
  async getAIMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAIMetrics(req.user.tenantId, filter);
  }

  @Get('timing')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get timing metrics' })
  async getTimingMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getTimingMetrics(req.user.tenantId, filter);
  }

  @Get('sla')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get SLA metrics' })
  async getSLAMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getSLAMetrics(req.user.tenantId, filter);
  }

  @Get('channels')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get metrics by channel' })
  async getChannelMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getChannelMetrics(req.user.tenantId, filter);
  }

  @Get('intents')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get intent metrics' })
  async getIntentMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getIntentMetrics(req.user.tenantId, filter);
  }

  @Get('hourly')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get hourly metrics' })
  async getHourlyMetrics(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getHourlyMetrics(req.user.tenantId, filter);
  }

  @Get('daily')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get daily trend' })
  async getDailyTrend(@Req() req: any, @Query() days: number = 30) {
    return this.analyticsService.getDailyTrend(req.user.tenantId, days);
  }

  @Get('agents')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get agent performance' })
  async getAgentPerformance(@Req() req: any, @Query() filter: AnalyticsFilterDto) {
    return this.analyticsService.getAgentPerformance(req.user.tenantId, filter);
  }

  @Get('dashboard')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  async getDashboardKPIs(@Req() req: any) {
    return this.analyticsService.getDashboardKPIs(req.user.tenantId);
  }

  @Get('csat')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get CSAT metrics' })
  async getCSATMetrics(@Req() req: any) {
    return this.analyticsService.getCSATMetrics(req.user.tenantId);
  }

  @Get('compare')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Compare periods' })
  async comparePeriods(@Req() req: any, @Query() dto: DateRangeDto) {
    const now = new Date();
    const ranges: Record<string, { currentStart: Date; currentEnd: Date; previousStart: Date; previousEnd: Date }> = {
      last7days: {
        currentStart: new Date(now.setDate(now.getDate() - 7)),
        currentEnd: new Date(),
        previousStart: new Date(now.setDate(now.getDate() - 14)),
        previousEnd: new Date(now.setDate(now.getDate() - 7)),
      },
      last30days: {
        currentStart: new Date(now.setDate(now.getDate() - 30)),
        currentEnd: new Date(),
        previousStart: new Date(now.setDate(now.getDate() - 60)),
        previousEnd: new Date(now.setDate(now.getDate() - 30)),
      },
      thisMonth: {
        currentStart: new Date(now.getFullYear(), now.getMonth(), 1),
        currentEnd: new Date(),
        previousStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        previousEnd: new Date(now.getFullYear(), now.getMonth(), 0),
      },
      lastMonth: {
        currentStart: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        currentEnd: new Date(now.getFullYear(), now.getMonth(), 0),
        previousStart: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        previousEnd: new Date(now.getFullYear(), now.getMonth() - 1, 0),
      },
    };

    const range = ranges[dto.range] || ranges.last30days;
    return this.analyticsService.comparePeriods(
      req.user.tenantId,
      range.currentStart,
      range.currentEnd,
      range.previousStart,
      range.previousEnd,
    );
  }
}