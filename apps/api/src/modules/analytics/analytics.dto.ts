import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean, IsUUID, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel, ConversationStatus } from '@prisma/client';

export class AnalyticsFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ enum: Channel })
  @IsOptional()
  @IsEnum(Channel)
  channel?: Channel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  agentId?: string;

  @ApiPropertyOptional({ enum: ConversationStatus })
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;
}

export class DateRangeDto {
  @ApiProperty({ enum: ['today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'thisYear', 'custom'] })
  @IsString()
  range: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

export class ExportReportDto {
  @ApiProperty({ enum: ['csv', 'xlsx', 'pdf'] })
  @IsString()
  format: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;
}

export class AggregatedMetricsDto {
  @ApiProperty()
  @IsString()
  metric: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  change?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  changePercentage?: number;
}