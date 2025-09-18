import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, PrismaService],
})
export class PedidosModule {}