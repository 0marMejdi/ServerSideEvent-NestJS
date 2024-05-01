import { Module, forwardRef } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { Skill } from '../skill/entities/skill.entity';
import { SseModule } from 'src/sse/sse.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, Skill]),
    MulterModule.register({
      dest: './public',
    }),
    AuthModule,
    forwardRef(()=>SseModule),
    
  ],
  controllers: [CvController],
  providers: [CvService],
})
export class CvModule {}
