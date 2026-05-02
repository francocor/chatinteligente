import { Module } from '@nestjs/common';
import { IntentDetector } from './intent-detector';
import { FlowExecutor } from './flow-executor';
import { ContextManager } from './context-manager';
import { ResponseGenerator } from './response-generator';
import { ChatEngine } from './chat-engine';
import { AIIntegration } from './ai-integration';

@Module({
  providers: [
    IntentDetector,
    FlowExecutor,
    ContextManager,
    ResponseGenerator,
    ChatEngine,
    AIIntegration,
  ],
  exports: [
    IntentDetector,
    FlowExecutor,
    ContextManager,
    ResponseGenerator,
    ChatEngine,
    AIIntegration,
  ],
})
export class EngineModule {}