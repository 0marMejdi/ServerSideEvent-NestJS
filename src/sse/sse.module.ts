import { Module } from '@nestjs/common';
import { SseService } from './sse.service';
import { SseController } from './sse.controller';
import { CvModule } from 'src/cv/cv.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEvent } from './entity/sseEntity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvEvent])
  ],
  controllers: [SseController],
  providers: [SseService,],
  exports: [SseService]
})
export class SseModule {}
