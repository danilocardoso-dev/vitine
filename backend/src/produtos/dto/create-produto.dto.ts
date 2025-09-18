import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber()
  preco: number;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsArray()
  tamanhos?: string[];

  @IsOptional()
  @IsArray()
  cores?: string[];

  @IsOptional()
  @IsArray()
  imagens?: string[];

  @IsNumber()
  estoque: number;

  @IsNumber()
  lojistaId: number;
}