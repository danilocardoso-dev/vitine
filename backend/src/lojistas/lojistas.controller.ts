import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { LojistasService } from './lojistas.service';
import { CreateLojistaDto } from './dto/create-lojista.dto';
import { UpdateLojistaDto } from './dto/update-lojista.dto';
import { JwtAuthGuard } from '../modules/auth/jwt.guard'; // ajuste o caminho conforme sua estrutura

@Controller('lojistas')
export class LojistasController {
  constructor(private readonly lojistasService: LojistasService) {}

  // 🔑 Criar lojista (protegido, vincula automaticamente ao userId)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLojistaDto, @Req() req: any) {
    const userId = req.user.sub; // vem do JWT payload
    return this.lojistasService.create(dto, userId);
  }

  // 🔑 Buscar lojistas do usuário logado
  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyLojistas(@Req() req: any) {
    const userId = req.user.sub;
    return this.lojistasService.findByUserId(userId);
  }

  // Listar todos (pode ser público ou protegido, dependendo do seu caso)
  @Get()
  findAll() {
    return this.lojistasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lojistasService.findOne(+id);
  }

  // 🔑 Atualizar apenas lojistas do próprio usuário
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLojistaDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.lojistasService.update(+id, dto, userId);
  }

  // 🔑 Deletar apenas lojistas do próprio usuário
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.lojistasService.remove(+id, userId);
  }
}