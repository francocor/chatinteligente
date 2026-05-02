import { 
  Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards, Req, Res 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WhatsAppService } from './whatsapp.service';
import { 
  CreateWhatsAppConfigDto, 
  UpdateWhatsAppConfigDto, 
  SendWhatsAppMessageDto,
  WhatsAppMessageFilterDto,
  WhatsAppEventLogFilterDto,
  WhatsAppWebhookDto,
  WhatsAppWebhookVerifyDto
} from './whatsapp.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Response, Request } from 'express';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  @Get('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get WhatsApp configuration' })
  async getConfig(@Req() req: any) {
    return this.whatsappService.getConfig(req.user.tenantId);
  }

  @Post('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create WhatsApp configuration' })
  @ApiResponse({ status: 201, description: 'Configuration created' })
  async createConfig(@Req() req: any, @Body() dto: CreateWhatsAppConfigDto) {
    return this.whatsappService.createConfig(req.user.tenantId, dto);
  }

  @Put('config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update WhatsApp configuration' })
  async updateConfig(@Req() req: any, @Body() dto: UpdateWhatsAppConfigDto) {
    return this.whatsappService.updateConfig(req.user.tenantId, dto);
  }

  @Post('config/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Verify WhatsApp configuration' })
  async verifyConfig(@Req() req: any) {
    return this.whatsappService.verifyConfig(req.user.tenantId);
  }

  @Post('messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'AGENT')
  @ApiOperation({ summary: 'Send WhatsApp message' })
  async sendMessage(
    @Req() req: any,
    @Query('conversationId') conversationId: string,
    @Body() dto: SendWhatsAppMessageDto
  ) {
    return this.whatsappService.sendMessage(req.user.tenantId, conversationId, dto);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get WhatsApp messages' })
  async getMessages(@Req() req: any, @Query() filter: WhatsAppMessageFilterDto) {
    return this.whatsappService.getMessages(req.user.tenantId, filter);
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN', 'SUPERVISOR')
  @ApiOperation({ summary: 'Get WhatsApp templates' })
  async getTemplates(@Req() req: any) {
    return this.whatsappService.getTemplates(req.user.tenantId);
  }

  @Post('templates/sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Sync WhatsApp templates from Meta' })
  async syncTemplates(@Req() req: any) {
    return this.whatsappService.syncTemplates(req.user.tenantId);
  }

  @Get('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get WhatsApp event logs' })
  async getEventLogs(@Req() req: any, @Query() filter: WhatsAppEventLogFilterDto) {
    return this.whatsappService.getEventLogs(req.user.tenantId, filter);
  }

  // ===========================================================
  // WEBHOOK ENDPOINTS (Public)
  // ===========================================================

  @Get('webhook')
  @ApiOperation({ summary: 'WhatsApp webhook verification (GET)' })
  async handleWebhookGet(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const mode = (req.query as any)['hub.mode'];
    const token = (req.query as any)['hub.verify_token'];
    const challenge = (req.query as any)['hub.challenge'];

    if (!mode || !token || !challenge) {
      return res.status(400).send('Missing parameters');
    }

    return res.status(200).send(challenge);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'WhatsApp webhook endpoint (POST)' })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  async handleWebhookPost(
    @Req() req: any,
    @Res() res: Response
  ) {
    try {
      const body = req.body;
      
      if (body.object !== 'whatsapp_business_account') {
        return res.status(404).send('Not found');
      }

      const tenantId = req.headers['x-tenant-id'] as string;
      
      if (!tenantId) {
        const config = await this.whatsappService.getConfig('default');
        if (!config) {
          return res.status(200).send('OK');
        }
      }

      await this.whatsappService.handleWebhook(tenantId || req.headers['x-tenant-id'], body);
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(200).send('OK');
    }
  }
}