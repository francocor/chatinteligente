import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AgentsModule } from './modules/agents/agents.module';
import { FlowsModule } from './modules/flows/flows.module';
// import { AIModule } from './modules/ai/ai.module'; // pending: re-enable once TS errors in engine are confirmed fixed
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ChatModule } from './modules/chat/chat.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TicketsModule } from './modules/tickets/tickets.module';
// import { WhatsAppModule } from './modules/whatsapp/whatsapp.module'; // DISABLED: 10 TS errors — fix in Fase 11

@Module({
  imports: [
    // Config must be first
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Database
    PrismaModule,
    
    // Core modules
    AuthModule,
    TenantsModule,
    UsersModule,
    
    // Business modules
    ConversationsModule,
    MessagesModule,
    AgentsModule,
    FlowsModule,
    // AIModule, // pending re-enable after build confirms engine TS fixes
    AnalyticsModule,
    AlertsModule,
    WebhooksModule,
    KnowledgeModule,
    TicketsModule,
    // WhatsAppModule, // DISABLED — fix in Fase 11

    // Real-time chat
    ChatModule,
  ],
})
export class AppModule {}