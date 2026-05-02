import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassifyDto {
  @ApiProperty()
  @IsString()
  text: string;
}

export class GenerateDto {
  @ApiProperty()
  @IsString()
  intent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class SearchKnowledgeDto {
  @ApiProperty()
  @IsString()
  query: string;
}