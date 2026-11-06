import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class RegisterDto {

     @ApiProperty({
       example: 'Abebe Kebede',
       description: 'The full name of the user (between 4 and 20 characters)',
       minLength: 4,
       maxLength: 20,
     })
     @IsNotEmpty({ message: 'Name is Required' })
     @IsString({ message: 'Name must be a string' })
     @MinLength(4, { message: 'Name must be atleast 4 characters' })
     @MaxLength(20, { message: 'Name must not exceed 20s characters' })
     name!: string;

     @ApiProperty({
       example: 'abebe@example.com',
       description: 'The email address used for registration and login',
     })
     @IsNotEmpty({ message: 'Email is Required' })
     @IsEmail({}, { message: 'Please Provide a Valid Email' })
     email!: string;

     @ApiProperty({
       example: 'Password123!',
       description: 'The secure password for the account (minimum 6 characters)',
       minLength: 6,
     })
     @IsNotEmpty({ message: 'Password is Required' })
     @MinLength(6, { message: 'Password must be atleast 6 characters' })
     password!: string;

}