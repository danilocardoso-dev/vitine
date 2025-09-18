// lojistas.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLojistaDto } from './dto/create-lojista.dto';
import { UpdateLojistaDto } from './dto/update-lojista.dto';

@Injectable()
export class LojistasService {
  constructor(private prisma: PrismaService) {}

  // 🔑 Criar lojista vinculado ao userId
  async create(dto: CreateLojistaDto, userId: number) {
    return this.prisma.lojista.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // 🔑 Buscar lojistas de um usuário específico
  async findByUserId(userId: number) {
    return this.prisma.lojista.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // Listar todos
  async findAll() {
    return this.prisma.lojista.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const lojista = await this.prisma.lojista.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!lojista) {
      throw new NotFoundException('Lojista não encontrado');
    }

    return lojista;
  }

  // 🔑 Atualizar apenas se for dono
  async update(id: number, dto: UpdateLojistaDto, userId: number) {
    const lojista = await this.prisma.lojista.findUnique({ where: { id } });
    
    if (!lojista) {
      throw new NotFoundException('Lojista não encontrado');
    }

    if (lojista.userId !== userId) {
      throw new ForbiddenException('Você não pode editar este lojista');
    }

    return this.prisma.lojista.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // 🔑 Deletar apenas se for dono
  async remove(id: number, userId: number) {
    const lojista = await this.prisma.lojista.findUnique({ where: { id } });
    
    if (!lojista) {
      throw new NotFoundException('Lojista não encontrado');
    }

    if (lojista.userId !== userId) {
      throw new ForbiddenException('Você não pode deletar este lojista');
    }

    return this.prisma.lojista.delete({ where: { id } });
  }
}