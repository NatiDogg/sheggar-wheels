import { Controller,UseGuards,Get,Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/googleAuthGuard';
import { RegisterDto } from './dto/registerDto';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {


       constructor(private readonly authService:AuthService){}



       @Throttle({default: {limit: 5, ttl: 60000}})
       @Post('register')
       async signUp(@Body() registrationDetails:RegisterDto){
          return await this.authService.signUp(registrationDetails)
       }

       @Throttle({default: {limit: 4, ttl: 60000}})
       @Post('login')
       async login(@Body() loginDetails:LoginDto){
           return await this.authService.login(loginDetails)
       }

       @Get('google')
       @UseGuards(GoogleAuthGuard)
       async googleAuth(@Req() req: Request){

       }


       @Get('google/callback')
        @UseGuards(GoogleAuthGuard)
       async googleAuthRedirect(@Req() req:Request){
           const googleUser = (req as any).user as {
              email: string;
             isemailverified: boolean;
              name: string;
             profileImg: string;
           }

           return await this.authService.validateGoogleUser(googleUser)
       }

     







}
