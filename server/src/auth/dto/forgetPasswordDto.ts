import { IsEmail, IsNotEmpty } from "class-validator";


export class ForgetPasswordDto{

     @IsNotEmpty({message: 'Email is Required'})
     @IsEmail({},{message: 'Please Provide a Valid Email'})
     email!: string
}