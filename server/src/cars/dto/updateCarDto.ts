
import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './createCarDto';

export class UpdateCarDto extends PartialType(
  CreateCarDto,
  { skipNullProperties: false },
) {}
