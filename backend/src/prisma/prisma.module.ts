import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // deixa o módulo acessível em toda a aplicação
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}