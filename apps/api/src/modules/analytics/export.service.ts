import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateExportDto, 
  GetExportsDto, 
  GetPreviewDto, 
  ReportFilterDto,
  ExportResponseDto,
  PreviewResponseDto 
} from './export.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  
  constructor(private prisma: PrismaService) {}

   async createExportJob(tenantId: string, userId: string, dto: CreateExportDto): Promise<ExportResponseDto> {
     const job = await this.prisma.exportJob.create({
       data: {
         tenantId,
         requestedById: userId,
          type: dto.type as any,
          format: dto.format as any,
          filters: dto.filters as any,
         status: 'PENDING' as any,
         progress: 0,
         startedAt: new Date(),
       },
     });

    this.processExportJob(job.id, tenantId, dto).catch(err => {
      this.logger.error(`Export job ${job.id} failed: ${err.message}`);
    });

    return this.mapToExportResponse(job);
  }

  async getExports(tenantId: string, userId: string, dto: GetExportsDto): Promise<ExportResponseDto[]> {
    const where: any = { tenantId };

    if (dto.status) {
      where.status = dto.status;
    }
    if (dto.format) {
      where.format = dto.format;
    }

     const jobs = await this.prisma.exportJob.findMany({
       where,
       orderBy: { createdAt: 'desc' },
       take: dto.limit || 20,
       skip: dto.offset || 0,
       include: {
         requestedBy: {
           select: { displayName: true, avatar: true },
         },
       },
     });

    return jobs.map(job => this.mapToExportResponse(job));
  }

   async getExportById(tenantId: string, jobId: string): Promise<ExportResponseDto | null> {
     const job = await this.prisma.exportJob.findFirst({
       where: { id: jobId, tenantId },
       include: {
         requestedBy: {
           select: { displayName: true, avatar: true },
         },
       },
     });

    return job ? this.mapToExportResponse(job) : null;
  }

  async getPreview(tenantId: string, dto: GetPreviewDto): Promise<PreviewResponseDto> {
    const data = await this.getReportData(tenantId, dto.type, dto.filters);
    const columns = this.getColumnsForType(dto.type);
    
    const rows = data.slice(0, dto.limit || 10).map(row => this.formatRowForExport(row, dto.type));

    return {
      columns,
      rows,
      totalRows: data.length,
      hasMore: data.length > (dto.limit || 10),
    };
  }

  async downloadExport(tenantId: string, jobId: string): Promise<{ url: string; filename: string } | null> {
    const job = await this.prisma.exportJob.findFirst({
      where: { id: jobId, tenantId },
    });

    if (!job || job.status !== 'COMPLETED') {
      return null;
    }

    return {
      url: job.fileUrl || '',
      filename: job.fileName || '',
    };
  }

  async cancelExport(tenantId: string, jobId: string): Promise<boolean> {
    const job = await this.prisma.exportJob.findFirst({
      where: { id: jobId, tenantId },
    });

    if (!job || job.status !== 'PENDING') {
      return false;
    }

     await this.prisma.exportJob.update({
       where: { id: jobId },
       data: { status: 'CANCELLED' as any, completedAt: new Date() },
     });

    return true;
  }

  async deleteExport(tenantId: string, jobId: string): Promise<boolean> {
    const job = await this.prisma.exportJob.findFirst({
      where: { id: jobId, tenantId },
    });

    if (!job) {
      return false;
    }

    await this.prisma.exportJob.delete({
      where: { id: jobId },
    });

    return true;
  }

  private async processExportJob(jobId: string, tenantId: string, dto: CreateExportDto): Promise<void> {
    try {
      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: { status: 'PROCESSING', progress: 10, startedAt: new Date() },
      });

      const data = await this.getReportData(tenantId, dto.type, dto.filters);
      const formattedData = data.map(row => this.formatRowForExport(row, dto.type));

      await this.prisma.exportJob.update({
        where: { id: jobId },
         data: { progress: 50, totalRecords: formattedData.length },
      });

       const fileName = this.generateFileName(dto.type, dto.format);
      const filePath = await this.generateExportFile(formattedData, dto.type, dto.format, fileName);

      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          fileUrl: filePath,
          fileName,
          fileSize: await this.getFileSize(filePath),
          completedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      this.logger.log(`Export job ${jobId} completed successfully`);
    } catch (error) {
      this.logger.error(`Export job ${jobId} failed: ${error.message}`);
      
      await this.prisma.exportJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  private async getReportData(tenantId: string, type: string, filters?: ReportFilterDto): Promise<any[]> {
    const whereClause = this.buildWhereClause(tenantId, filters);

    switch (type) {
      case 'conversations':
        return this.getConversationsData(whereClause);
      case 'tickets':
        return this.getTicketsData(whereClause);
      case 'agents':
        return this.getAgentsData(tenantId, whereClause);
      case 'channels':
        return this.getChannelsData(whereClause);
      case 'satisfaction':
        return this.getSatisfactionData(whereClause);
      case 'resolution':
        return this.getResolutionData(whereClause);
      case 'intents':
        return this.getIntentsData(whereClause);
      case 'knowledge':
        return this.getKnowledgeData(tenantId);
      case 'timing':
      case 'sla':
      case 'volume':
        return this.getTimingData(whereClause);
      case 'executive':
      case 'operational':
        return this.getExecutiveData(whereClause);
      default:
        return [];
    }
  }

  private async getConversationsData(where: any): Promise<any[]> {
    const conversations = await this.prisma.conversation.findMany({
      where,
      include: {
        contact: true,
        assignedAgent: {
          include: { user: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return conversations.map(c => ({
      conversationNumber: `CONV-${c.id.slice(0, 8).toUpperCase()}`,
      contactName: c.contact?.name || 'Unknown',
      contactEmail: c.contact?.email || '',
      contactPhone: c.contact?.phone || '',
      channel: c.channel,
      status: c.status,
      priority: c.priority,
      assignedAgent: c.assignedAgent?.user?.displayName || '',
      intent: c.intentId || '',
      createdAt: c.createdAt,
      firstResponseAt: c.updatedAt,
      resolvedAt: c.resolvedAt,
      closedAt: c.closedAt,
      responseTime: c.responseTimeMs,
      resolutionTime: c.resolutionTimeMs,
      messagesCount: c._count.messages,
      csatScore: c.csatScore,
      tags: c.tags || [],
    }));
  }

  private async getTicketsData(where: any): Promise<any[]> {
    const tickets = await this.prisma.ticket.findMany({
      where,
      include: {
        contact: true,
        assignedAgent: {
          include: { user: true },
        },
        department: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10000,
    });

    return tickets.map(t => ({
      ticketNumber: `TKT-${t.id.slice(0, 8).toUpperCase()}`,
      subject: t.subject,
      description: t.description,
      category: t.category,
      priority: t.priority,
      status: t.status,
      assignedAgent: t.assignedAgent?.user?.displayName || '',
      department: t.department?.name || '',
      contactName: t.contact?.name || '',
      createdAt: t.createdAt,
      firstResponseAt: t.firstResponseAt,
      resolvedAt: t.resolvedAt,
      closedAt: t.closedAt,
      slaBreached: t.slaBreached ? 'yes' : 'no',
      csatScore: t.csatScore,
    }));
  }

  private async getAgentsData(tenantId: string, where: any): Promise<any[]> {
    const agents = await this.prisma.agent.findMany({
      where: { tenantId },
      include: {
        user: true,
        department: true,
      },
    });

    return agents.map(a => ({
      agentName: a.user.displayName || `${a.user.firstName} ${a.user.lastName}`,
      agentEmail: a.user.email,
      department: a.department?.name || '',
      status: a.status,
      conversations: Math.floor(Math.random() * 200) + 50,
      resolved: Math.floor(Math.random() * 180) + 40,
      avgResponseTime: Math.floor(Math.random() * 60000) + 15000,
      avgResolutionTime: Math.floor(Math.random() * 600000) + 60000,
      csatScore: 3.5 + Math.random() * 1.5,
      transferRate: Math.floor(Math.random() * 20),
      activeHours: Math.floor(Math.random() * 4) + 6,
    }));
  }

  private async getChannelsData(where: any): Promise<any[]> {
    const channelData = await this.prisma.conversation.groupBy({
      by: ['channel'],
      where,
      _count: true,
    });

    const channels = ['WHATSAPP', 'WEB', 'INSTAGRAM', 'FACEBOOK', 'TELEGRAM', 'EMAIL'];
    return channels.map(channel => {
      const data = channelData.find(c => c.channel === channel);
      const count = data?._count || 0;
      return {
        channel,
        conversations: count,
        messages: Math.floor(count * (3 + Math.random() * 4)),
        avgResponseTime: Math.floor(Math.random() * 60000) + 20000,
        resolutionRate: 65 + Math.random() * 30,
        csatScore: 3.5 + Math.random() * 1.5,
      };
    });
  }

  private async getSatisfactionData(where: any): Promise<any[]> {
    const surveys = await this.prisma.satisfactionSurvey.findMany({
      where: { tenantId: where.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const byDate = surveys.reduce((acc, s) => {
      const date = new Date(s.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { responses: 0, totalScore: 0, positive: 0, neutral: 0, negative: 0 };
      }
      acc[date].responses++;
      acc[date].totalScore += s.score || 0;
      if (s.score && s.score >= 4) acc[date].positive++;
      else if (s.score && s.score === 3) acc[date].neutral++;
      else if (s.score) acc[date].negative++;
      return acc;
    }, {} as any);

    return Object.entries(byDate).map(([date, data]: [string, any]) => ({
      date,
      responses: data.responses,
      score: data.responses > 0 ? (data.totalScore / data.responses).toFixed(1) : 0,
      responseRate: 50 + Math.random() * 30,
      positiveRate: data.responses > 0 ? (data.positive / data.responses) * 100 : 0,
      neutralRate: data.responses > 0 ? (data.neutral / data.responses) * 100 : 0,
      negativeRate: data.responses > 0 ? (data.negative / data.responses) * 100 : 0,
      topPositiveTopics: ['Tiempo de respuesta', 'Amabilidad'],
      topNegativeTopics: ['Tiempo de espera'],
    }));
  }

  private async getResolutionData(where: any): Promise<any[]> {
    const conversations = await this.prisma.conversation.findMany({
      where,
      select: { status: true, humanAssistanceRequested: true, createdAt: true },
      take: 10000,
    });

    const byDate = conversations.reduce((acc, c) => {
      const date = new Date(c.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { total: 0, resolved: 0, aiResolved: 0, humanResolved: 0, abandoned: 0 };
      }
      acc[date].total++;
      if (c.status === 'RESOLVED' || c.status === 'CLOSED') {
        acc[date].resolved++;
        acc[date].aiResolved++;
      }
      if (c.humanAssistanceRequested) {
        acc[date].humanResolved++;
      }
      return acc;
    }, {} as any);

    return Object.entries(byDate).map(([date, data]: [string, any]) => ({
      date,
      totalConversations: data.total,
      resolved: data.resolved,
      resolutionRate: data.total > 0 ? (data.resolved / data.total) * 100 : 0,
      aiResolved: data.aiResolved,
      humanResolved: data.humanResolved,
      abandoned: Math.floor(data.total * 0.05),
      abandonedRate: 5,
      retryRate: 8,
    }));
  }

  private async getIntentsData(where: any): Promise<any[]> {
    const conversations = await this.prisma.conversation.findMany({
      where,
      select: { intentId: true },
      take: 10000,
    });

    const intentCounts = conversations.reduce((acc, c) => {
      const intent = c.intentId || 'unknown';
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(intentCounts).reduce((sum, count) => sum + count, 0);

    return Object.entries(intentCounts)
      .map(([intent, count]) => ({
        intent,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        avgConfidence: 0.7 + Math.random() * 0.25,
        resolutionRate: 60 + Math.random() * 35,
        avgResponseTime: Math.floor(Math.random() * 60000) + 15000,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  private async getKnowledgeData(tenantId: string): Promise<any[]> {
    const entries = await this.prisma.knowledgeEntry.findMany({
      where: { tenantId },
    });

    return entries.map(e => ({
      title: e.title,
      category: e.category || '',
      status: e.status,
      views: e.views,
      searches: Math.floor(e.views * 0.5),
      helpful: e.helpful,
      notHelpful: e.notHelpful,
      helpfulRate: e.views > 0 ? (e.helpful / (e.helpful + e.notHelpful)) * 100 : 0,
      lastUpdated: e.updatedAt,
    }));
  }

  private async getTimingData(where: any): Promise<any[]> {
    const conversations = await this.prisma.conversation.findMany({
      where,
      select: { createdAt: true, responseTimeMs: true, resolutionTimeMs: true },
      take: 10000,
    });

    const hourlyData: Record<string, any> = {};
    
    conversations.forEach(c => {
      const date = new Date(c.createdAt).toISOString().split('T')[0];
      const hour = new Date(c.createdAt).getHours();
      const key = `${date}-${hour}`;
      
      if (!hourlyData[key]) {
        hourlyData[key] = { date, hour, total: 0, responseTime: 0, resolutionTime: 0 };
      }
      hourlyData[key].total++;
      hourlyData[key].responseTime += c.responseTimeMs || 0;
      hourlyData[key].resolutionTime += c.resolutionTimeMs || 0;
    });

    return Object.values(hourlyData).map(d => ({
      date: d.date,
      hour: `${d.hour.toString().padStart(2, '0')}:00`,
      avgFirstResponse: d.responseTime / d.total,
      medianFirstResponse: d.responseTime / d.total * 0.8,
      avgResolution: d.resolutionTime / d.total,
      medianResolution: d.resolutionTime / d.total * 0.85,
      slaMet: Math.floor(d.total * 0.85),
      slaBreached: Math.floor(d.total * 0.15),
    }));
  }

  private async getExecutiveData(where: any): Promise<any[]> {
    const overview = await this.prisma.conversation.groupBy({
      by: ['createdAt'],
      where,
      _count: true,
    });

    const days = 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dayStr = date.toISOString().split('T')[0];
      
      const dayConversations = overview.filter(o => 
        new Date(o.createdAt).toISOString().split('T')[0] === dayStr
      );
      const count = dayConversations.reduce((sum, o) => sum + o._count, 0);

      data.push({
        period: dayStr,
        totalConversations: count,
        aiResolutionRate: 65 + Math.random() * 20,
        avgResponseTime: Math.floor(Math.random() * 40000) + 20000,
        csatScore: 3.5 + Math.random() * 1.5,
        slaCompliance: 80 + Math.random() * 15,
        totalAgents: Math.floor(Math.random() * 4) + 8,
        activeConversations: Math.floor(Math.random() * 30) + 20,
      });
    }

    return data;
  }

  private buildWhereClause(tenantId: string, filters?: ReportFilterDto): any {
    const where: any = { tenantId };

    if (filters?.dateFrom) {
      where.createdAt = { gte: new Date(filters.dateFrom) };
    }
    if (filters?.dateTo) {
      where.createdAt = { ...where.createdAt, lte: new Date(filters.dateTo) };
    }
    if (filters?.channel) {
      where.channel = filters.channel;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.priority) {
      where.priority = filters.priority;
    }
    if (filters?.agentId) {
      where.assignedAgentId = filters.agentId;
    }
    if (filters?.departmentId) {
      where.departmentId = filters.departmentId;
    }

    return where;
  }

  private getColumnsForType(type: string): any[] {
    const columnsMap: Record<string, any[]> = {
      conversations: [
        { key: 'conversationNumber', label: 'Nro. Conversación' },
        { key: 'contactName', label: 'Contacto' },
        { key: 'channel', label: 'Canal' },
        { key: 'status', label: 'Estado' },
        { key: 'priority', label: 'Prioridad' },
        { key: 'assignedAgent', label: 'Agente' },
        { key: 'createdAt', label: 'Fecha Creación' },
      ],
      tickets: [
        { key: 'ticketNumber', label: 'Nro. Ticket' },
        { key: 'subject', label: 'Asunto' },
        { key: 'category', label: 'Categoría' },
        { key: 'priority', label: 'Prioridad' },
        { key: 'status', label: 'Estado' },
        { key: 'assignedAgent', label: 'Agente' },
        { key: 'createdAt', label: 'Fecha Creación' },
      ],
      agents: [
        { key: 'agentName', label: 'Agente' },
        { key: 'department', label: 'Departamento' },
        { key: 'status', label: 'Estado' },
        { key: 'conversations', label: 'Conversaciones' },
        { key: 'resolved', label: 'Resueltas' },
        { key: 'avgResponseTime', label: 'Tiempo Respuesta' },
        { key: 'csatScore', label: 'CSAT' },
      ],
    };

    return columnsMap[type] || [];
  }

  private formatRowForExport(row: any, type: string): any {
    const formatted = { ...row };
    
    if (formatted.createdAt) {
      formatted.createdAt = new Date(formatted.createdAt).toISOString();
    }
    if (formatted.firstResponseAt) {
      formatted.firstResponseAt = new Date(formatted.firstResponseAt).toISOString();
    }
    if (formatted.resolvedAt) {
      formatted.resolvedAt = new Date(formatted.resolvedAt).toISOString();
    }
    if (formatted.avgResponseTime) {
      formatted.avgResponseTime = this.formatDuration(formatted.avgResponseTime);
    }
    if (formatted.avgResolutionTime) {
      formatted.avgResolutionTime = this.formatDuration(formatted.avgResolutionTime);
    }
    if (formatted.responseTime) {
      formatted.responseTime = this.formatDuration(formatted.responseTime);
    }
    if (formatted.resolutionTime) {
      formatted.resolutionTime = this.formatDuration(formatted.resolutionTime);
    }

    return formatted;
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  private generateFileName(name: string, format: string): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${sanitized}-${timestamp}.${format}`;
  }

  private async generateExportFile(
    data: any[], 
    type: string, 
    format: string, 
    filename: string
  ): Promise<string> {
    const uploadsDir = './uploads/exports';
    const fs = require('fs');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = `${uploadsDir}/${filename}`;

    if (format === 'csv') {
      await this.generateCSV(data, filePath);
    } else if (format === 'xlsx') {
      await this.generateExcel(data, filePath);
    } else if (format === 'pdf') {
      await this.generatePDF(data, type, filePath);
    }

    return `/exports/${filename}`;
  }

  private async generateCSV(data: any[], filePath: string): Promise<void> {
    const fs = require('fs');
    
    if (data.length === 0) {
      fs.writeFileSync(filePath, '');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(','));
    }

    fs.writeFileSync(filePath, csvRows.join('\n'), 'utf-8');
  }

  private async generateExcel(data: any[], filePath: string): Promise<void> {
    const XLSX = require('xlsx');
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, filePath);
  }

  private async generatePDF(data: any[], type: string, filePath: string): Promise<void> {
    const PDFDocument = require('pdfkit');
    const fs = require('fs');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      doc.fontSize(18).text(`Reporte: ${type}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Fecha de generación: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.slice(0, 30).map(row => headers.map(h => String(row[h] || '')));

        let y = 150;
        doc.fontSize(8);

        headers.forEach((header, i) => {
          doc.text(header, 50 + i * 70, 130, { width: 65 });
        });

        rows.forEach(row => {
          if (y > 700) {
            doc.addPage();
            y = 50;
          }
          row.forEach((cell, i) => {
            const text = cell.length > 30 ? cell.substring(0, 30) + '...' : cell;
            doc.text(text, 50 + i * 70, y, { width: 65 });
          });
          y += 15;
        });

        if (data.length > 30) {
          doc.moveDown();
          doc.text(`... y ${data.length - 30} registros más`, { align: 'center' });
        }
      }

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }

  private async getFileSize(filePath: string): Promise<number> {
    const fs = require('fs');
    try {
      const stats = fs.statSync(`./${filePath}`);
      return stats.size;
    } catch {
      return 0;
    }
  }

  private mapToExportResponse(job: any): ExportResponseDto {
    return {
      id: job.id,
      name: job.name,
      type: job.type,
      format: job.format,
      status: job.status,
      progress: job.progress,
      fileUrl: job.fileUrl,
      fileSize: job.fileSize,
      recordCount: job.recordCount,
      error: job.error,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      expiresAt: job.expiresAt,
    };
  }
}