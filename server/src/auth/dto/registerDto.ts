import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator'

export class RegisterDto{

     @IsNotEmpty({message: 'Name is Required'})
     @IsString({message: 'Name must be a string'})
     @MinLength(4, {message: 'Name must be atleast 4 characters'})
     @MinLength(20, {message: 'Name must not exceed 20s characters'})
     name!: string

     @IsNotEmpty({message: 'Email is Required'})
     @IsEmail({}, {message: 'Please Provide a Valid Email'})
     email!: string

     @IsNotEmpty({message: 'Password is Required'})
     @MinLength(6, {message: 'Password must be atleast 6 characters'})
     password!: string

}