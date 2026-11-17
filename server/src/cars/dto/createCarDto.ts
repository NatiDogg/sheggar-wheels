import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateCarDto {
  @ApiProperty({
    description: 'Brand or manufacturer of the car',
    example: 'Toyota',
    minLength: 2,
    maxLength: 50,
  })
  @Transform(trimString)
  @IsNotEmpty({ message: 'Make name is required' })
  @IsString({ message: 'Make name must be a string' })
  @MinLength(2, { message: 'Make name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Make name must not exceed 50 characters' })
  make!: string;

  @ApiProperty({
    description: 'Model name of the car',
    example: 'Corolla',
    minLength: 2,
    maxLength: 50,
  })
  @Transform(trimString)
  @IsNotEmpty({ message: 'Model is required' })
  @IsString({ message: 'Model must be a string' })
  @MinLength(2, { message: 'Model must be at least 2 characters long' })
  @MaxLength(50, { message: 'Model must not exceed 50 characters' })
  model!: string;

  @ApiProperty({
    description: 'Manufacturing year of the car',
    example: 2023,
    minimum: 1900,
    maximum: new Date().getFullYear() + 1,
  })
  @IsNotEmpty({ message: 'Year is required' })
  @Type(() => Number)
  @IsInt({ message: 'Year must be an integer' })
  @Min(1900, { message: 'Year must not be older than 1900' })
  @Max(new Date().getFullYear() + 1, {
    message: `Year cannot be later than ${new Date().getFullYear() + 1}`,
  })
  year!: number;

  @ApiProperty({
    description: 'Total passenger seating capacity',
    example: 5,
    minimum: 1,
    maximum: 15,
  })
  @IsNotEmpty({ message: 'Seating capacity is required' })
  @Type(() => Number)
  @IsInt({ message: 'Seating capacity must be an integer' })
  @Min(1, { message: 'Seating capacity must be at least 1' })
  @Max(15, { message: 'Seating capacity must not exceed 15 seats' })
  seatingCapacity!: number;

  @ApiProperty({
    description: 'Brief summary of the car condition and features',
    example: 'Clean fuel-efficient sedan with automatic transmission and AC.',
    minLength: 6,
    maxLength: 500,
  })
  @Transform(trimString)
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(6, { message: 'Description must be at least 6 characters long' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description!: string;

  @ApiProperty({
    description: 'Price of the car (up to 2 decimal places)',
    example: 25000.0,
    minimum: 0.01,
    maximum: 99999999.99,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be greater than 0' })
  @Max(99999999.99, { message: 'Price is too large' })
  price!: number;
}