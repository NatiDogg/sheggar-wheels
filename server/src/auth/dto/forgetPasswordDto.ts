import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'The registered email address to send the reset link to',
    })
    @IsNotEmpty({ message: 'Email is Required' })
    @IsEmail({}, { message: 'Please Provide a Valid Email' })
    email!: string;
}