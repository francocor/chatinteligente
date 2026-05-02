import { 
  IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean, 
  IsUUID, IsArray, IsObject, IsDate, Min, Max 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel, ConversationStatus, TicketStatus, Priority } from '@prisma/client';

export class ReportFilterDto {
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
  companyId?: string;

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

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ enum: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED', 'CANCELLED'] })
  @IsOptional()
  @IsString()
  ticketStatus?: TicketStatus;

  @ApiPropertyOptional({ enum: ['technical', 'billing', 'support', 'sales', 'complaint', 'other'] })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  intentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  flowId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateExportDto {
  @ApiProperty({ enum: ['executive', 'operational', 'conversations', 'tickets', 'agents', 'channels', 'satisfaction', 'resolution', 'intents', 'knowledge', 'timing', 'sla', 'volume'] })
  @IsString()
  type: string;

  @ApiProperty({ enum: ['csv', 'xlsx', 'pdf'] })
  @IsString()
  format: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: ReportFilterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;
}

export class GetExportsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional({ enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ enum: ['csv', 'xlsx', 'pdf'] })
  @IsOptional()
  @IsString()
  format?: string;
}

export class GetPreviewDto {
  @ApiProperty({ enum: ['executive', 'operational', 'conversations', 'tickets', 'agents', 'channels', 'satisfaction', 'resolution', 'intents', 'knowledge', 'timing', 'sla', 'volume'] })
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters?: ReportFilterDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class ExportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  format: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  progress?: number;

  @ApiPropertyOptional()
  fileUrl?: string;

  @ApiPropertyOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  recordCount?: number;

  @ApiPropertyOptional()
  error?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  expiresAt?: Date;
}

export class PreviewResponseDto {
  @ApiProperty()
  columns: any[];

  @ApiProperty()
  rows: any[];

  @ApiProperty()
  totalRows: number;

  @ApiProperty()
  hasMore: boolean;
}