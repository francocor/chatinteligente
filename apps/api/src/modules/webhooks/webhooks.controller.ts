import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './webhooks.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('webhooks')
@Controller('webhooks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create webhook' })
  async create(@Req() req: any, @Body() dto: CreateWebhookDto) {
    return this.webhooksService.create(req.user.tenantId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get all webhooks' })
  async findAll(@Req() req: any) {
    return this.webhooksService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get webhook by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.webhooksService.findOne(req.user.tenantId, id);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Delete webhook' })
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.webhooksService.remove(req.user.tenantId, id);
  }
}