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
// import { AIModule } from './modules/ai/ai.module'; // DISABLED: TypeScript errors
// import { AnalyticsModule } from './modules/analytics/analytics.module'; // DISABLED: TypeScript errors
// import { AlertsModule } from './modules/alerts/alerts.module'; // DISABLED: TypeScript errors
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ChatModule } from './modules/chat/chat.module';

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
    // AIModule, // DISABLED
    // AnalyticsModule, // DISABLED
    // AlertsModule, // DISABLED
    WebhooksModule,
    
    // Real-time chat
    ChatModule,
  ],
})
export class AppModule {}