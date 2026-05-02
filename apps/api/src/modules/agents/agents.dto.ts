import { IsString, IsOptional, IsArray, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxConcurrentConversations?: number;
}

export class UpdateAgentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxConcurrentConversations?: number;
}

export class AgentStatusDto {
  @ApiProperty({ enum: ['ONLINE', 'AWAY', 'BUSY', 'OFFLINE'] })
  @IsString()
  status: string;
}