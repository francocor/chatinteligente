import { Module } from '@nestjs/common';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppRetryService } from './whatsapp-retry.service';

@Module({
  controllers: [WhatsAppController],
  providers: [WhatsAppService, WhatsAppRetryService],
  exports: [WhatsAppService, WhatsAppRetryService],
})
export class WhatsAppModule {}