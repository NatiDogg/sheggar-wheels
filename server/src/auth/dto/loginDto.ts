import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // 1. Import ApiProperty

export class LoginDto {
    
     @ApiProperty({
       example: 'abebe@example.com',
       description: 'The email address associated with your account',
     })
     @IsNotEmpty({ message: 'Email is Required' })
     @IsEmail({}, { message: 'Please Provide a Valid Email' })
     email!: string;

     @ApiProperty({
       example: 'Password123!',
       description: 'Your account password',
       minLength: 6,
     })
     @IsNotEmpty({ message: 'Password is Required' })
     @MinLength(6, { message: 'Password must be atleast 6 characters' })
     password!: string;

}