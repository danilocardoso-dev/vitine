import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  // Criar produto (admin)
  async create(dto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: dto,
    });
  }

  // Listar todos os produtos (admin)
  async findAll() {
    return this.prisma.produto.findMany({
      include: {
        lojista: {
          select: {
            id: true,
            nome: true,
            email: true,
            cidade: true,
            estado: true,
          },
        },
      },
    });
  }

  // Buscar produto por ID (admin ou detalhe público)
  async findOne(id: number) {
    return this.prisma.produto.findUnique({
      where: { id },
      include: {
        lojista: {
          select: {
            id: true,
            nome: true,
            email: true,
            cidade: true,
            estado: true,
          },
        },
      },
    });
  }

  // Atualizar produto (admin)
  async update(id: number, dto: UpdateProdutoDto) {
    return this.prisma.produto.update({
      where: { id },
      data: dto,
    });
  }

  // Remover produto (admin)
  async remove(id: number) {
    return this.prisma.produto.delete({
      where: { id },
    });
  }

  // 👇 NOVO: Buscar produtos ativos para a vitrine (público)
  async findAllAtivos() {
    return this.prisma.produto.findMany({
      where: { isActive: true }, // considerar que o modelo Produto tem um campo "ativo"
      include: {
        lojista: {
          select: {
            id: true,
            nome: true,
            cidade: true,
            estado: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // opcional: ordenar por data de criação
      },
    });
  }
}