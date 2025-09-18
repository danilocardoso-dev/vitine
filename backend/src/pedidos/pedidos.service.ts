import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePedidoDto) {
    // calcular valor total
    const valorTotal = dto.itens.reduce(
      (acc, item) => acc + item.precoUnit * item.quantidade,
      0,
    );

    return this.prisma.pedido.create({
      data: {
        clienteNome: dto.clienteNome,
        clienteEmail: dto.clienteEmail,
        clienteTelefone: dto.clienteTelefone,
        clienteEndereco: dto.clienteEndereco,
        lojistaId: dto.lojistaId,
        observacoes: dto.observacoes,
        valorTotal,
        numeroVenda: `PED-${Date.now()}`, // simples para MVP
        itens: {
          create: dto.itens.map((item) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: item.precoUnit,
            tamanho: item.tamanho,
            cor: item.cor,
          })),
        },
      },
      include: { itens: true },
    });
  }

  findAll() {
  return this.prisma.pedido.findMany({
    include: {
      itens: {
        include: {
          produto: {
            select: {
              id: true,
              nome: true,
              categoria: true,
              imagens: true,
            },
          },
        },
      },
      lojista: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

findOne(id: number) {
  return this.prisma.pedido.findUnique({
    where: { id },
    include: {
      itens: {
        include: {
          produto: {
            select: {
              id: true,
              nome: true,
              categoria: true,
              imagens: true,
              tamanhos: true,
              cores: true,
              preco: true,
            },
          },
        },
      },
      lojista: true,
    },
  });
}

  update(id: number, dto: UpdatePedidoDto) {
    return this.prisma.pedido.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.pedido.delete({ where: { id } });
  }
}