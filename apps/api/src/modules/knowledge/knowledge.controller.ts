import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { 
  CreateKnowledgeEntryDto, 
  UpdateKnowledgeEntryDto, 
  KnowledgeFilterDto,
  SearchKnowledgeDto,
  MarkHelpfulDto,
  CreateCategoryDto,
  UpdateCategoryDto
} from './knowledge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('knowledge')
@Controller('knowledge')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Create knowledge entry' })
  async create(@Req() req: any, @Body() dto: CreateKnowledgeEntryDto) {
    return this.knowledgeService.create(req.user.tenantId, req.user.id, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get all knowledge entries' })
  async findAll(@Req() req: any, @Query() filter: KnowledgeFilterDto) {
    return this.knowledgeService.findAll(req.user.tenantId, filter);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get knowledge statistics' })
  async getStats(@Req() req: any) {
    return this.knowledgeService.getStats(req.user.tenantId);
  }

  @Get('search')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Search knowledge base' })
  async search(@Req() req: any, @Query() dto: SearchKnowledgeDto) {
    return this.knowledgeService.search(req.user.tenantId, dto);
  }

  @Get('categories')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get all categories' })
  async findAllCategories(@Req() req: any) {
    return this.knowledgeService.findAllCategories(req.user.tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Get knowledge entry by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.knowledgeService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Update knowledge entry' })
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateKnowledgeEntryDto) {
    return this.knowledgeService.update(req.user.tenantId, id, dto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete knowledge entry' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.knowledgeService.remove(req.user.tenantId, id);
  }

  @Post(':id/helpful')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Mark entry as helpful/not helpful' })
  async markHelpful(@Req() req: any, @Param('id') id: string, @Body() dto: MarkHelpfulDto) {
    return this.knowledgeService.markHelpful(req.user.tenantId, id, dto.helpful);
  }

  @Post(':id/summary')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Generate AI summary for entry' })
  async generateSummary(@Req() req: any, @Param('id') id: string) {
    return this.knowledgeService.generateSummary(req.user.tenantId, id);
  }
}