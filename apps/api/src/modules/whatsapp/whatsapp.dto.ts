import { 
  IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsDateString, IsUUID, IsArray, IsObject, IsUrl 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWhatsAppConfigDto {
  @ApiProperty()
  @IsString()
  phoneNumberId: string;

  @ApiProperty()
  @IsString()
  businessAccountId: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsString()
  webhookVerifyToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  webhookSecret?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: WhatsAppSettingsDto;
}

export class UpdateWhatsAppConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: Partial<WhatsAppSettingsDto>;
}

export class WhatsAppSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoCreateContact?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoAssignAgent?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  defaultDepartmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  defaultFlowId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  greetingMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  offlineMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  humanRequestMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  workingHours?: WorkingHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  templates?: {
    greeting?: string;
    humanOffer?: string;
    offline?: string;
    resolution?: string;
    csat?: string;
  };
}

export class WorkingHoursDto {
  @ApiProperty()
  @IsString()
  timezone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  monday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  tuesday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  wednesday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  thursday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  friday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  saturday?: DayHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  sunday?: DayHoursDto;
}

export class DayHoursDto {
  @ApiProperty()
  @IsString()
  start: string;

  @ApiProperty()
  @IsString()
  end: string;
}

export class SendWhatsAppMessageDto {
  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty({ enum: ['TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT', 'INTERACTIVE'] })
  @IsEnum(['TEXT', 'IMAGE', 'AUDIO', 'VIDEO', 'DOCUMENT', 'INTERACTIVE'])
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mediaCaption?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  interactive?: {
    type: 'LIST' | 'BUTTONS';
    body: string;
    footer?: string;
    buttons?: { id: string; title: string }[];
    sections?: {
      title: string;
      rows: { id: string; title: string; description?: string }[];
    }[];
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templateName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  templateParams?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contextWamid?: string;
}

export class WhatsAppWebhookDto {
  @ApiProperty()
  @IsString()
  object: string;

  @ApiProperty()
  @IsArray()
  entry: any[];
}

export class WhatsAppWebhookVerifyDto {
  @ApiProperty()
  @IsString()
  'hub.mode': string;

  @ApiProperty()
  @IsString()
  'hub.verify_token': string;

  @ApiProperty()
  @IsString()
  'hub.challenge': string;
}

export class WhatsAppTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  headerText?: string;

  @ApiProperty()
  @IsString()
  bodyContent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  footerText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  buttons?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  parameters?: any[];
}

export class WhatsAppMessageFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ enum: ['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'] })
  @IsOptional()
  @IsEnum(['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsString()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsString()
  offset?: number;
}

export class WhatsAppEventLogFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['MESSAGE_RECEIVED', 'MESSAGE_SENT', 'MESSAGE_DELIVERED', 'MESSAGE_READ', 'MESSAGE_FAILED'])
  eventType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wamid?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;
}

// Response DTOs
export class WhatsAppConfigResponseDto {
  id: string;
  phoneNumberId: string;
  phoneNumber: string;
  businessName: string;
  isActive: boolean;
  isVerified: boolean;
  messagesReceived: number;
  messagesSent: number;
  createdAt: Date;
  config: any;
}

export class WhatsAppMessageResponseDto {
  id: string;
  wamid: string;
  conversationId?: string;
  from: string;
  to: string;
  type: string;
  text?: string;
  status: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export class WhatsAppEventLogResponseDto {
  id: string;
  eventType: string;
  wamid?: string;
  from?: string;
  to?: string;
  status: string;
  error?: string;
  duration: number;
  createdAt: Date;
}