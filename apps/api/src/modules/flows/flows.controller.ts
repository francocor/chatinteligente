import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FlowsService } from './flows.service';
import { CreateFlowDto, UpdateFlowDto, DuplicateFlowDto, PublishFlowDto } from './flows.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('flows')
@Controller('flows')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FlowsController {
  constructor(private flowsService: FlowsService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create new flow' })
  async create(@Req() req: any, @Body() dto: CreateFlowDto) {
    return this.flowsService.create(req.user.tenantId, dto, req.user.id);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get all flows' })
  async findAll(@Req() req: any) {
    return this.flowsService.findAll(req.user.tenantId);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get flow statistics' })
  async getStats(@Req() req: any, @Query('id') id: string) {
    return this.flowsService.getStats(req.user.tenantId, id);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get flow by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.flowsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update flow' })
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateFlowDto) {
    return this.flowsService.update(req.user.tenantId, id, dto);
  }

  @Post(':id/publish')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Publish flow' })
  async publish(@Req() req: any, @Param('id') id: string, @Body() dto: PublishFlowDto) {
    if (dto.publish === false) {
      return this.flowsService.unpublish(req.user.tenantId, id);
    }
    return this.flowsService.publish(req.user.tenantId, id);
  }

  @Post(':id/toggle')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Toggle flow active status' })
  async toggleActive(@Req() req: any, @Param('id') id: string) {
    return this.flowsService.toggleActive(req.user.tenantId, id);
  }

  @Post(':id/duplicate')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Duplicate flow' })
  async duplicate(@Req() req: any, @Param('id') id: string, @Body() dto: DuplicateFlowDto) {
    return this.flowsService.duplicate(req.user.tenantId, id, dto, req.user.id);
  }

  @Put(':id/nodes')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update flow nodes' })
  async updateNodes(@Req() req: any, @Param('id') id: string, @Body() body: { nodes: any[]; edges: any[] }) {
    return this.flowsService.updateNodes(req.user.tenantId, id, body.nodes, body.edges);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete flow' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.flowsService.remove(req.user.tenantId, id);
  }
}