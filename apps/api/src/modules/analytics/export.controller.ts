import { 
  Controller, Get, Post, Delete, Body, Query, Param, UseGuards, Req, Res, HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { CreateExportDto, GetExportsDto, GetPreviewDto } from './export.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

@ApiTags('exports')
@Controller('exports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Create a new export job' })
  @ApiResponse({ status: 201, description: 'Export job created' })
  async createExport(@Req() req: any, @Body() dto: CreateExportDto) {
    return this.exportService.createExportJob(req.user.tenantId, req.user.userId, dto);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get export history' })
  async getExports(@Req() req: any, @Query() dto: GetExportsDto) {
    return this.exportService.getExports(req.user.tenantId, req.user.userId, dto);
  }

  @Get('preview')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get export preview' })
  async getPreview(@Req() req: any, @Query() dto: GetPreviewDto) {
    return this.exportService.getPreview(req.user.tenantId, dto);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get export job by ID' })
  @ApiParam({ name: 'id', description: 'Export job ID' })
  async getExport(@Req() req: any, @Param('id') id: string) {
    return this.exportService.getExportById(req.user.tenantId, id);
  }

  @Post(':id/cancel')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Cancel export job' })
  @ApiParam({ name: 'id', description: 'Export job ID' })
  async cancelExport(@Req() req: any, @Param('id') id: string) {
    const result = await this.exportService.cancelExport(req.user.tenantId, id);
    return { success: result };
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Delete export job' })
  @ApiParam({ name: 'id', description: 'Export job ID' })
  async deleteExport(@Req() req: any, @Param('id') id: string) {
    const result = await this.exportService.deleteExport(req.user.tenantId, id);
    return { success: result };
  }

  @Get(':id/download')
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Download exported file' })
  @ApiParam({ name: 'id', description: 'Export job ID' })
  async downloadExport(
    @Req() req: any, 
    @Param('id') id: string,
    @Res() res: Response
  ) {
    const exportData = await this.exportService.downloadExport(req.user.tenantId, id);
    
    if (!exportData) {
      res.status(HttpStatus.NOT_FOUND).json({ 
        message: 'Export not found or not ready' 
      });
      return;
    }

    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join('./uploads/exports', exportData.filename);
    
    if (!fs.existsSync(filePath)) {
      res.status(HttpStatus.NOT_FOUND).json({ 
        message: 'File not found on server' 
      });
      return;
    }

    res.setHeader('Content-Type', this.getContentType(exportData.filename));
    res.setHeader('Content-Disposition', `attachment; filename="${exportData.filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  private getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const types: Record<string, string> = {
      csv: 'text/csv',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
    };
    return types[ext || ''] || 'application/octet-stream';
  }
}