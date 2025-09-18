import { IsString, IsEmail, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateItemPedidoDto } from './create-item-pedido.dto';

export class CreatePedidoDto {
  @IsString()
  clienteNome: string;

  @IsEmail()
  clienteEmail: string;

  @IsString()
  clienteTelefone: string;

  @IsOptional()
  @IsString()
  clienteEndereco?: string;

  @IsNumber()
  lojistaId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemPedidoDto)
  itens: CreateItemPedidoDto[];

  @IsOptional()
  @IsString()
  observacoes?: string;
}