import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [EngineModule],
  controllers: [AIController],
  providers: [AIService],
  exports: [AIService, EngineModule],
})
export class AIModule {}