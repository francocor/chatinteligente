import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateKnowledgeEntryDto, 
  UpdateKnowledgeEntryDto, 
  KnowledgeFilterDto,
  SearchKnowledgeDto,
  MarkHelpfulDto,
  CreateCategoryDto,
  UpdateCategoryDto
} from './knowledge.dto';

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

   async create(tenantId: string, userId: string, dto: CreateKnowledgeEntryDto): Promise<any> {
     const entry = await this.prisma.knowledgeEntry.create({
       data: {
         tenantId,
         title: dto.title,
         content: dto.content,
         summary: dto.summary,
         category: dto.category,
         tags: dto.tags || [],
         sourceType: (dto.sourceType as any) || 'ARTICLE',
         sourceUrl: dto.sourceUrl,
         flowId: dto.flowId,
          status: 'ACTIVE',
         author: userId,
       },
     });

     if (dto.category) {
       await this.prisma.knowledgeEntry.updateMany({
         where: { tenantId, category: dto.category },
         data: {},
       });
     }

     return entry;
   }

   async findAll(tenantId: string, filter: KnowledgeFilterDto): Promise<{ entries: any[]; total: number }> {
     const where: any = { tenantId };

     if (filter.category) where.category = filter.category;
     if (filter.status) where.status = filter.status as any;
     if (filter.sourceType) where.sourceType = filter.sourceType;
     if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;
     if (filter.tags && filter.tags.length > 0) where.tags = { hasSome: filter.tags };

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
        { summary: { contains: filter.search, mode: 'insensitive' } },
        { keywords: { hasSome: filter.search.split(' ') } },
      ];
    }

    if (filter.dateFrom || filter.dateTo) {
      where.createdAt = {};
      if (filter.dateFrom) where.createdAt.gte = new Date(filter.dateFrom);
      if (filter.dateTo) where.createdAt.lte = new Date(filter.dateTo);
    }

    const [entries, total] = await Promise.all([
      this.prisma.knowledgeEntry.findMany({
        where,
        include: { flow: true },
        orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
        skip: filter.offset || 0,
        take: filter.limit || 20,
      }),
      this.prisma.knowledgeEntry.count({ where }),
    ]);

    return { entries, total };
  }

  async findOne(tenantId: string, id: string): Promise<any> {
    const entry = await this.prisma.knowledgeEntry.findFirst({
      where: { id, tenantId },
      include: { flow: true },
    });

    if (!entry) {
      throw new NotFoundException('Knowledge entry not found');
    }

    await this.prisma.knowledgeEntry.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return entry;
  }

  async update(tenantId: string, id: string, dto: UpdateKnowledgeEntryDto): Promise<any> {
    await this.findOne(tenantId, id);

    const updateData: any = {};
    
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.summary !== undefined) updateData.summary = dto.summary;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.keywords !== undefined) updateData.keywords = dto.keywords;
    if (dto.variants !== undefined) updateData.variants = dto.variants;
    if (dto.sourceUrl !== undefined) updateData.sourceUrl = dto.sourceUrl;
    if (dto.flowId !== undefined) updateData.flowId = dto.flowId;
    if (dto.intentNames !== undefined) updateData.intentNames = dto.intentNames;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.isFeatured !== undefined) updateData.isFeatured = dto.isFeatured;
    if (dto.status !== undefined) updateData.status = dto.status;

    return this.prisma.knowledgeEntry.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(tenantId: string, id: string): Promise<void> {
    await this.findOne(tenantId, id);
    await this.prisma.knowledgeEntry.delete({ where: { id } });
  }

  async search(tenantId: string, dto: SearchKnowledgeDto): Promise<any[]> {
    const where: any = {
      tenantId,
      isActive: true,
      status: { in: ['ACTIVE', 'REVIEW'] },
    };

    if (dto.exactMatch) {
      where.AND = [
        { title: { equals: dto.query, mode: 'insensitive' } },
      ];
    } else {
      where.OR = [
        { title: { contains: dto.query, mode: 'insensitive' } },
        { content: { contains: dto.query, mode: 'insensitive' } },
        { keywords: { hasSome: dto.query.toLowerCase().split(' ') } },
        { variants: { hasSome: { in: [dto.query.toLowerCase()] } } },
      ];
    }

    return this.prisma.knowledgeEntry.findMany({
      where,
      take: dto.limit || 10,
       orderBy: [{ views: 'desc' }],
    });
  }

  async searchKnowledge(tenantId: string, query: string): Promise<any[]> {
    return this.prisma.knowledgeEntry.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    });
  }

  async markHelpful(tenantId: string, id: string, helpful: boolean): Promise<any> {
    await this.findOne(tenantId, id);

    const updateData = helpful 
      ? { helpful: { increment: 1 } }
      : { notHelpful: { increment: 1 } };

    return this.prisma.knowledgeEntry.update({
      where: { id },
      data: updateData,
    });
  }

  async getStats(tenantId: string): Promise<any> {
    const [total, active, drafts, featured, byCategory, bySource, totalViews, totalHelpful] = await Promise.all([
      this.prisma.knowledgeEntry.count({ where: { tenantId } }),
       this.prisma.knowledgeEntry.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.knowledgeEntry.count({ where: { tenantId, status: 'DRAFT' } }),
       this.prisma.knowledgeEntry.count({ where: { tenantId, status: 'ACTIVE' } }),
      this.prisma.knowledgeEntry.groupBy({
        by: ['category'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.knowledgeEntry.groupBy({
        by: ['sourceType'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.knowledgeEntry.aggregate({
        where: { tenantId },
        _sum: { views: true },
      }),
      this.prisma.knowledgeEntry.aggregate({
        where: { tenantId },
        _sum: { helpful: true },
      }),
    ]);

    const categoryBreakdown: Record<string, number> = {};
    for (const cat of byCategory) {
      categoryBreakdown[cat.category || 'Uncategorized'] = cat._count;
    }

    const sourceBreakdown: Record<string, number> = {};
    for (const src of bySource) {
      sourceBreakdown[src.sourceType] = src._count;
    }

    return {
      total,
      active,
      drafts,
      featured,
      byCategory: categoryBreakdown,
      bySource: sourceBreakdown,
      totalViews: totalViews._sum?.views || 0,
      totalHelpful: totalHelpful._sum?.helpful || 0,
    };
  }

  async createCategory(tenantId: string, dto: CreateCategoryDto): Promise<any> {
    return this.prisma.knowledgeEntry.findMany({
      where: { tenantId, category: dto.name },
      take: 0,
    }).then(async () => {
      return { id: `cat-${Date.now()}`, name: dto.name };
    });
  }

  async findAllCategories(tenantId: string): Promise<any[]> {
    const results = await this.prisma.knowledgeEntry.groupBy({
      by: ['category'],
      where: { tenantId },
      _count: true,
    });

    return results.map(r => ({
      id: r.category || 'uncategorized',
      name: r.category || 'Sin categoría',
      entryCount: r._count,
    }));
  }

  async generateSummary(tenantId: string, id: string): Promise<any> {
    const entry = await this.findOne(tenantId, id);
    
    const summary = entry.content.substring(0, 200) + (entry.content.length > 200 ? '...' : '');

    return this.prisma.knowledgeEntry.update({
      where: { id },
      data: { summary },
    });
  }
}