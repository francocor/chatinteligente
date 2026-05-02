import { IsString, IsOptional, IsEnum, IsArray, IsObject, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Channel, MessageDirection, MessageContentType, MessageFromType } from '@prisma/client';

export class CreateMessageDto {
  @ApiProperty({ enum: MessageDirection })
  @IsEnum(MessageDirection)
  direction: MessageDirection;

  @ApiPropertyOptional({ enum: Channel })
  @IsOptional()
  @IsEnum(Channel)
  channel?: Channel;

  @ApiPropertyOptional({ enum: MessageContentType })
  @IsOptional()
  @IsEnum(MessageContentType)
  contentType?: MessageContentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  mediaUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiProperty({ enum: MessageFromType })
  @IsEnum(MessageFromType)
  fromType: MessageFromType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sentiment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intentName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  intentConfidence?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  entities?: Record<string, any>;
}