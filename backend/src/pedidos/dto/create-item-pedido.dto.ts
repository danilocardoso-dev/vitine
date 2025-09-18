import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemPedidoDto {
  @IsNumber()
  produtoId: number;

  @IsNumber()
  quantidade: number;

  @IsNumber()
  precoUnit: number;

  @IsOptional()
  @IsString()
  tamanho?: string;

  @IsOptional()
  @IsString()
  cor?: string;
}