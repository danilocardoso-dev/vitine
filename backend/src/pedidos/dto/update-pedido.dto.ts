import { IsOptional, IsString } from 'class-validator';

export class UpdatePedidoDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}