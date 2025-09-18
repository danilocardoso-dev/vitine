import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  // 👇 MOVER ESTA ROTA PARA O TOPO (antes do @Get() genérico)
  @Get('vitrine')
  getVitrine() {
    return this.produtosService.findAllAtivos();
  }

  @Post()
  create(@Body() dto: CreateProdutoDto) {
    return this.produtosService.create(dto);
  }

  // 👇 @Get() genérico vem DEPOIS das rotas específicas
  @Get()
  findAll() {
    return this.produtosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProdutoDto) {
    return this.produtosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}