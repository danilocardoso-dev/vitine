import { Module } from '@nestjs/common';
import { LojistasService } from './lojistas.service';
import { LojistasController } from './lojistas.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LojistasController],
  providers: [LojistasService, PrismaService],
})
export class LojistasModule {}