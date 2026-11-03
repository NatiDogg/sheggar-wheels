import { Controller,UseGuards,Get,Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/googleAuthGuard';

@Controller('auth')
export class AuthController {


       constructor(private readonly authService:AuthService){}


     







}
