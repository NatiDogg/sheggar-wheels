import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const MAX_YEAR = new Date().getFullYear() + 1;
const MAX_PRICE = 99999999.99;

export class QueryCarDto {
  @ApiPropertyOptional({
    description: 'Search term matched against car make, model, or description',
    example: 'Corolla',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(trimString)
  @IsString({ message: 'Search query must be a string' })
  @MaxLength(100, { message: 'Search query must not exceed 100 characters' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Minimum price filter (up to 2 decimal places)',
    example: 10000,
    minimum: 0,
    maximum: MAX_PRICE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'minPrice must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'minPrice cannot be negative' })
  @Max(MAX_PRICE, { message: 'minPrice is too large' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter (up to 2 decimal places)',
    example: 40000,
    minimum: 0,
    maximum: MAX_PRICE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'maxPrice must be a valid number with up to 2 decimal places' },
  )
  @Min(0, { message: 'maxPrice cannot be negative' })
  @Max(MAX_PRICE, { message: 'maxPrice is too large' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Earliest manufacturing year',
    example: 2015,
    minimum: 1900,
    maximum: MAX_YEAR,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'minYear must be an integer' })
  @Min(1900, { message: 'minYear must not be older than 1900' })
  @Max(MAX_YEAR, { message: `minYear cannot be later than ${MAX_YEAR}` })
  minYear?: number;

  @ApiPropertyOptional({
    description: 'Latest manufacturing year',
    example: 2025,
    minimum: 1900,
    maximum: MAX_YEAR,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'maxYear must be an integer' })
  @Min(1900, { message: 'maxYear must not be older than 1900' })
  @Max(MAX_YEAR, { message: `maxYear cannot be later than ${MAX_YEAR}` })
  maxYear?: number;

  @ApiPropertyOptional({
    description: 'Minimum passenger seating capacity',
    example: 4,
    minimum: 1,
    maximum: 15,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'minSeatingCapacity must be an integer' })
  @Min(1, { message: 'minSeatingCapacity must be at least 1' })
  @Max(15, { message: 'minSeatingCapacity must not exceed 15 seats' })
  minSeatingCapacity?: number;
}