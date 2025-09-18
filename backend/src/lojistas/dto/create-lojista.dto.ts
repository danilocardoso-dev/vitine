// dto/create-lojista.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateLojistaDto {
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  telefone?: string;

  @IsOptional()
  endereco?: string;

  @IsOptional()
  cidade?: string;

  @IsOptional()
  estado?: string;

  @IsOptional()
  cep?: string;

  @IsOptional()
  @IsIn(['basico', 'premium'])
  plano?: string;
}