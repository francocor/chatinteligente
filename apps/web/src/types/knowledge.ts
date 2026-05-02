export type KnowledgeSource = 
  | 'ARTICLE'
  | 'FAQ'
  | 'DOCUMENT'
  | 'WEBPAGE'
  | 'MANUAL'
  | 'POLICY';

export type KnowledgeStatus = 
  | 'DRAFT'
  | 'REVIEW'
  | 'ACTIVE'
  | 'ARCHIVED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH';

export interface KnowledgeEntry {
  id: string;
  tenantId: string;
  
  title: string;
  content: string;
  summary?: string;
  
  // Categorization
  category: string;
  tags: string[];
  keywords: string[];
  variants: string[];
  
  // Source info
  sourceType: KnowledgeSource;
  sourceUrl?: string;
  
  // Flow/Intent associations
  flowId?: string;
  flow?: {
    id: string;
    name: string;
  };
  intentNames?: string[];
  
  // Status
  status: KnowledgeStatus;
  isActive: boolean;
  isFeatured: boolean;
  
  // AI/RAG
  embedding?: number[];
  chunks?: KnowledgeChunk[];
  
  // Metadata
  author?: string;
  metadata?: Record<string, any>;
  
  // Usage stats
  views: number;
  helpful: number;
  notHelpful: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding?: number[];
  sourceStart?: number;
  sourceEnd?: number;
}

export interface KnowledgeCategory {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  entryCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface KnowledgeFilters {
  category?: string;
  status?: KnowledgeStatus;
  sourceType?: KnowledgeSource;
  tags?: string[];
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  isFeatured?: boolean;
}

export interface KnowledgeStats {
  total: number;
  active: number;
  drafts: number;
  featured: number;
  byCategory: Record<string, number>;
  bySource: Record<KnowledgeSource, number>;
  totalViews: number;
  totalHelpful: number;
}

export interface KnowledgeSearchResult {
  entry: KnowledgeEntry;
  score: number;
  matchedKeywords: string[];
  matchedChunks?: string[];
}

export interface KnowledgeExport {
  format: 'json' | 'csv' | 'markdown';
  entries: string[];
}