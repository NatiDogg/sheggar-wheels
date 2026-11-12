import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        example: 'NewSecurePassword123',
        description: 'The new password for the account, minimum 6 characters',
        minLength: 6,
    })
    @IsNotEmpty({ message: 'Password is Required' })
    @MinLength(6, { message: 'Password must be atleast 6 characters' })
    password!: string;

    @ApiProperty({
        example: '4a6f72676574546f6b656e4578616d706c65...',
        description: 'The raw token extracted from the email reset link',
    })
    @IsNotEmpty({ message: 'Token is Required' })
    @IsString({ message: 'Token must be a string' })
    token!: string;
}