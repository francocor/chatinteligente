import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessMessageDto {
  @ApiProperty()
  @IsString()
  conversationId: string;

  @ApiProperty()
  @IsString()
  contactId: string;

  @ApiProperty()
  @IsString()
  message: string;
}

export class OfferHumanDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conversationId?: string;
}

export class GenerateAIDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class SentimentDto {
  @ApiProperty()
  @IsString()
  text: string;
}

export class EntitiesDto {
  @ApiProperty()
  @IsString()
  text: string;
}