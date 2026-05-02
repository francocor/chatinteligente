import { IsString, IsOptional, IsArray, IsObject, IsBoolean, IsEnum, IsUUID, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class NodeResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsEnum(['text', 'image', 'carousel', 'buttons', 'list'])
  type: 'text' | 'image' | 'carousel' | 'buttons' | 'list';

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  mediaUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  quickReplies?: { label: string; value: string; nextNodeId?: string }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  buttons?: { label: string; value: string; action?: string; url?: string; flowId?: string }[];
}

export class NodeLogicDto {
  @ApiProperty()
  @IsEnum(['intent_match', 'keyword_match', 'always', 'entity_match', 'custom'])
  type: 'intent_match' | 'keyword_match' | 'always' | 'entity_match' | 'custom';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  entities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customCode?: string;
}

export class FlowNodeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  nodeId: string;

  @ApiProperty()
  @IsEnum(['question', 'choice', 'text', 'action', 'condition', 'ai_response', 'transfer', 'close', 'delay', 'webhook'])
  type: 'question' | 'choice' | 'text' | 'action' | 'condition' | 'ai_response' | 'transfer' | 'close' | 'delay' | 'webhook';

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsObject()
  position: { x: number; y: number };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => NodeLogicDto)
  logic?: NodeLogicDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NodeResponseDto)
  responses?: NodeResponseDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  conditions?: { id: string; field: string; operator: string; value: string; nextNodeId: string }[];
}

export class FlowEdgeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty()
  @IsString()
  target: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  condition?: string;
}

export class FlowDefinitionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FlowNodeDto)
  nodes?: FlowNodeDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FlowEdgeDto)
  edges?: FlowEdgeDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entryPoint?: string;
}

export class CreateFlowDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  triggerKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  triggerIntent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsEnum(['WEB', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TELEGRAM', 'EMAIL'], { each: true })
  triggerChannel?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowDefinitionDto)
  definition?: FlowDefinitionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entryPoint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fallbackMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableHumanHandoff?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  handoffThreshold?: number;
}

export class UpdateFlowDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  triggerKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  triggerIntent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsEnum(['WEB', 'WHATSAPP', 'FACEBOOK', 'INSTAGRAM', 'TELEGRAM', 'EMAIL'], { each: true })
  triggerChannel?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => FlowDefinitionDto)
  definition?: FlowDefinitionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entryPoint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  exitPoint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fallbackMessage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enableHumanHandoff?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  handoffThreshold?: number;
}

export class PublishFlowDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  publish?: boolean;
}

export class DuplicateFlowDto {
  @ApiProperty()
  @IsString()
  name: string;
}