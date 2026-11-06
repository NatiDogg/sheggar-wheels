import { Controller,UseGuards,Get,Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/googleAuthGuard';
import { RegisterDto } from './dto/registerDto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {


       constructor(private readonly authService:AuthService){}



       @Throttle({default: {limit: 5, ttl: 60000}})
       @Post('register')
       async signUp(@Body() registrationDetails:RegisterDto){
          return await this.authService.signUp(registrationDetails)
       }

     







}
