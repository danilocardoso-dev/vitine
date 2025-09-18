import { PartialType } from '@nestjs/mapped-types';
import { CreateLojistaDto } from './create-lojista.dto';

export class UpdateLojistaDto extends PartialType(CreateLojistaDto) {}