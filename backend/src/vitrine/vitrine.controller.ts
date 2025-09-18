import { Controller, Get, Param } from '@nestjs/common';
import { VitrineService } from './vitrine.service';

@Controller('vitrine')
export class VitrineController {
  constructor(private readonly vitrineService: VitrineService) {}

  // rota pública para listar todos os produtos
  @Get()
  findAll() {
    return this.vitrineService.findAll();
  }

  // rota pública para listar produtos de um lojista específico
  @Get(':lojistaId')
  findByLojista(@Param('lojistaId') lojistaId: string) {
    return this.vitrineService.findByLojista(+lojistaId);
  }
}