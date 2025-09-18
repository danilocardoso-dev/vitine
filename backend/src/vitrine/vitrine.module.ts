import { Module } from '@nestjs/common';
import { VitrineService } from './vitrine.service';
import { VitrineController } from './vitrine.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VitrineController],
  providers: [VitrineService, PrismaService],
})
export class VitrineModule {}