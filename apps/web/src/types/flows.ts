export type NodeType = 
  | 'question'
  | 'choice'
  | 'text'
  | 'action'
  | 'condition'
  | 'ai_response'
  | 'transfer'
  | 'close'
  | 'delay'
  | 'webhook';

export type NodeLogicType =
  | 'intent_match'
  | 'keyword_match'
  | 'always'
  | 'entity_match'
  | 'custom';

export interface FlowNode {
  id: string;
  nodeId: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  config: NodeConfig;
  logic?: NodeLogic;
  responses?: NodeResponse[];
  conditions?: Condition[];
}

export interface NodeConfig {
  required?: boolean;
  saveToField?: string;
  validationPattern?: string;
  errorMessage?: string;
}

export interface NodeLogic {
  type: NodeLogicType;
  intent?: string;
  keywords?: string[];
  entities?: string[];
  customCode?: string;
}

export interface NodeResponse {
  id: string;
  type: 'text' | 'image' | 'carousel' | 'buttons' | 'list';
  content: string;
  mediaUrls?: string[];
  quickReplies?: QuickReplyOption[];
  buttons?: ButtonOption[];
}

export interface QuickReplyOption {
  id: string;
  label: string;
  value: string;
  nextNodeId?: string;
}

export interface ButtonOption {
  id: string;
  label: string;
  value: string;
  action?: 'url' | 'flow' | 'close' | 'transfer';
  url?: string;
  flowId?: string;
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater' | 'less';
  value: string;
  nextNodeId: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  triggerKeywords: string[];
  triggerIntent?: string;
  triggerChannel: Channel[];
  definition: FlowDefinition;
  nodes: FlowNode[];
  edges: FlowEdge[];
  version: number;
  isActive: boolean;
  isPublished: boolean;
  entryPoint?: string;
  exitPoint?: string;
  departmentId?: string;
  department?: Department;
  totalStarts: number;
  completions: number;
  abandonRate: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface FlowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
  entryPoint?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  priority: number;
  isActive: boolean;
}

export type Channel = 'WEB' | 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'TELEGRAM' | 'EMAIL';

export interface FlowFormData {
  name: string;
  description: string;
  triggerKeywords: string[];
  triggerIntent?: string;
  triggerChannel: Channel[];
  departmentId?: string;
  entryPoint?: string;
}

export interface FlowStats {
  totalStarts: number;
  completions: number;
  abandonRate: number;
  avgCompletionTime: number;
}