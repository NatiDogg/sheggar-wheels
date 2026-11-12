import { Controller, UseGuards, Get, Post, Body, Req, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/googleAuthGuard';
import { RegisterDto } from './dto/registerDto';
import { Throttle } from '@nestjs/throttler';
import { LoginDto } from './dto/loginDto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { env } from '../utils/zodEnvValidator';
import { JwtAuthGuard } from './guards/jwtAuthGuard';
import { CurrentUser } from './decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';


const setResponseCookies = (res: Response, tokens: { accessToken: string; refreshToken: string }) => {
      const isProduction = env.NODE_ENV === 'production';

      res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,                       
          secure: isProduction,        
          sameSite: isProduction ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000,         
      });

      res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,      
      });
}

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
       async loginHandler(@Body() loginDetails: LoginDto, @Res({passthrough: true}) res:Response) {

          const {accessToken, refreshToken, ...result} = await this.authService.login(loginDetails);

          setResponseCookies(res, {accessToken: accessToken, refreshToken: refreshToken})

          return result
         
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
       async googleAuthRedirectHandler(@Req() req: Request, @Res() res:Response) {
           const googleUser = (req as any).user as {
              email: string;
              isemailverified: boolean;
              name: string;
              profileImg: string;
           };

           const {accessToken,refreshToken, ...result}  = await this.authService.validateGoogleUser(googleUser);

           setResponseCookies(res, {accessToken: accessToken, refreshToken: refreshToken})

           return res.redirect(`${env.FRONTEND_URL ||  "http://localhost:3000"}/auth/success`)
       }

       @ApiOperation({ summary: 'Verify user email via token link' })
       @ApiQuery({ name: 'token', required: true, description: 'JWT verification token received via email' })
       @ApiResponse({ status: 302, description: 'Redirects to frontend login page with success or failure query parameters.' })
       @Get('verify-email')
       async verifyEmailHandler(@Query('token') token: string, @Res() res: Response){
            if(!token){
                return res.redirect(`${env.FRONTEND_URL}/login?error=missing_token`);
            }

           try {
             await this.authService.verifyEmail(token);
             return res.redirect(`${env.FRONTEND_URL}/login?verified=true`);
           } catch (error) {
             return res.redirect(`${env.FRONTEND_URL}/login?verified=false`);
           }
       }

       @UseGuards(JwtAuthGuard)
       @Get('profile')
       async getProfile(@CurrentUser() user: Omit<User, 'password'>){
          return {user: user}
       }


       @ApiOperation({ summary: 'Log out user and clear session cookies' })
       @ApiResponse({ status: 200, description: 'Logged out successfully.' })
       @Post('logout')
       async logoutHandler(@Req() Req:Request, @Res() res:Response){
          const isProduction = env.NODE_ENV === 'production';
            const cookieOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? ('none' as const) : ('lax' as const),
            };

            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            return res.status(200).json({
                success: true,
                message: 'Logged out successfully.',
            });
       }
}