import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.create(dto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}