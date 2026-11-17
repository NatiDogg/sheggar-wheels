import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import {Type,Transform} from 'class-transformer'

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
export class CreateCarDto{

      @Transform(trimString)
      @IsNotEmpty({message: "Make name is required"})
      @IsString({message:"Make name must be a string"})
      @MinLength(2,{message: 'Make name must be at least 2 characters long'})
      @MaxLength(50,{message: 'Make name must not exceed 50 characters'})
      make!: string


      @Transform(trimString)
      @IsNotEmpty({message: "Model is required"})
      @IsString({message:"Model must be a string"})
      @MinLength(2,{message: 'Model must be at least 2 characters long'})
      @MaxLength(50,{message: 'Model must not exceed 50 characters'})
      model!: string

      @IsNotEmpty({message: "Year is required"})
      @Type(()=> Number)
      @IsInt({ message: 'Year must be an integer' })
      @Min(1900, { message: "Year must not be older than 1900" })
      @Max(new Date().getFullYear() + 1, {
       message: `Year cannot be later than ${new Date().getFullYear() + 1}`,
       })
      year!:number

      @IsNotEmpty({ message: 'Seating capacity is required' })
      @Type(()=> Number)
      @IsInt({ message: 'Seating capacity must be an integer' })
      @Min(1, { message: 'Seating capacity must be at least 1' })
      @Max(15, { message: 'Seating capacity must not exceed 15 seats' })
      seatingCapacity!:number

      @Transform(trimString)
      @IsNotEmpty({message: 'Description is required'})
      @IsString({message: 'Description must be a string'})
      @MinLength(6, {message: 'Description must be at least 6 characters long'})
      @MaxLength(500, {message: 'Description must not exceed 500 characters'})
      description!: string

      @IsNotEmpty({message: 'Price is required'})
      @Type(() => Number)
      @IsNumber({maxDecimalPlaces: 2}, {message: 'Price must be a valid number with up to 2 decimal places'})
      @IsPositive({ message: 'Price must be greater than 0' })
      @Max(99999999.99, { message: 'Price is too large' })
      price!:number
      

}