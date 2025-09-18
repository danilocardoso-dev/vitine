import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VitrineService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.produto.findMany({
      where: { isActive: true },
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        categoria: true,
        tamanhos: true,
        cores: true,
        imagens: true,
        estoque: true,
        lojista: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
            plano: true,
          },
        },
      },
    });
  }

  findByLojista(lojistaId: number) {
    return this.prisma.produto.findMany({
      where: { isActive: true, lojistaId },
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        categoria: true,
        tamanhos: true,
        cores: true,
        imagens: true,
        estoque: true,
      },
    });
  }
}