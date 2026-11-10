import { Controller, UseGuards, Get, Post, Body, Req, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/googleAuthGuard';
import { RegisterDto } from './dto/registerDto';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from './dto/loginDto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

       constructor(private readonly authService: AuthService) {}

       @ApiOperation({ summary: 'Register a new local user' })
       @ApiResponse({ status: 201, description: 'User successfully registered and verification event emitted.' })
       @ApiResponse({ status: 409, description: 'Email already in use.' })
       @Throttle({ default: { limit: 5, ttl: 60000 } })
       @Post('register')
       async signUpHandler(@Body() registrationDetails: RegisterDto) {
          return await this.authService.signUp(registrationDetails);
       }

       @ApiOperation({ summary: 'Log in with email and password' })
       @ApiResponse({ status: 200, description: 'Login successful, returns user payload and JWT tokens.' })
       @ApiResponse({ status: 401, description: 'Invalid credentials or account uses Google Sign-In.' })
       @Throttle({ default: { limit: 4, ttl: 60000 } })
       @Post('login')
       async loginHandler(@Body() loginDetails: LoginDto) {
           return await this.authService.login(loginDetails);
       }

       @ApiOperation({ summary: 'Redirects to Google OAuth 2.0 consent screen' })
       @ApiResponse({ status: 302, description: 'Redirect to Google.' })
       @Get('google')
       @UseGuards(GoogleAuthGuard)
       async googleAuthHandler(@Req() req: Request) {
           // Handled entirely by passport guard redirect
       }

       @ApiOperation({ summary: 'Google OAuth callback handler' })
       @ApiResponse({ status: 200, description: 'Google sign-in successful, returns user session and tokens.' })
       @Get('google/callback')
       @UseGuards(GoogleAuthGuard)
       async googleAuthRedirectHandler(@Req() req: Request) {
           const googleUser = (req as any).user as {
              email: string;
              isemailverified: boolean;
              name: string;
              profileImg: string;
           };

           return await this.authService.validateGoogleUser(googleUser);
       }

       @Post('verify-email')
       async verifyEmailHandler(@Query('token') token: string){
           
            if(!token){
                 throw new BadRequestException('Verification token is required');
            }

            return await this.authService.verifyEmail(token)

        
       }
}