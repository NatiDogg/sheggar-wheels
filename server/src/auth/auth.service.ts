import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Provider, User } from 'prisma/generated/prisma/client';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/utils/bcryptService';
import { JwtService, TokenPayload } from 'src/utils/jwtService';
import { RegisterDto } from './dto/registerDto';
import { UserEventsService } from 'src/events/userEventsService';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly userEventService: UserEventsService,
  ) {}

  async signUp(registerDetails: RegisterDto) {
    const normalizedEmail = registerDetails.email.toLowerCase();
    const existingUser =
      await this.userService.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    const hashedPassword = await this.bcryptService.hashPassword(
      registerDetails.password,
    );

    const newlyCreatedUser = await this.userService.registerUser({
      ...registerDetails,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const verifyToken = this.jwtService.createAccessToken({
      id: newlyCreatedUser.id,
      name: newlyCreatedUser.name,
      email: newlyCreatedUser.email,
      role: newlyCreatedUser.role,
    });

    // emitting user registration event to send email to verify email

    this.userEventService.emitUserRegistered(newlyCreatedUser, verifyToken);

    return {
      success: true,
      message:
        'User registered successfully. Please check your email to verify.',
    };
  }

  async login(userDetails:LoginDto) {

      const normalizedEmail = userDetails.email.toLowerCase()
      const user = await this.userService.findUserByEmail(normalizedEmail)
      if(!user){
          throw new UnauthorizedException('Invalid Credentials!')
      }

      if(!user.password){
        throw new UnauthorizedException('This account uses Google Sign-In. Please log in with Google.');
      }

      if(!user.emailVerified){
         throw new UnauthorizedException("Your account hasn't been verified yet. Please check your email to continue.")
      }

      const comparedPassword = await this.bcryptService.matchPassword(userDetails.password, user.password)

      if(!comparedPassword){
          throw new UnauthorizedException('Invalid Credentials!')
      }

      const {password, ...safeUser} = user

      return this.generateUserTokenResponse(safeUser, 'User LoggedIn Successfully' )

  }

  async validateGoogleUser(googleUser: {
    email: string;
    isemailverified: boolean;
    name: string;
    profileImg: string;
  }) {
    const normalizedEmail = googleUser.email.toLowerCase();
    let user:any = await this.userService.findUserByEmail(normalizedEmail);

    if (!user) {
       const provider:Provider = 'GOOGLE'
      user = await this.userService.registerUser(
        { name: googleUser.name, email: normalizedEmail,profileImg: googleUser.profileImg },
        googleUser.isemailverified,
        provider
      );
    } 
    else {
      if (!user.emailVerified && googleUser.isemailverified) {
        user = await this.userService.updateEmailVerifiedStatus(user.id, true);
      }
    }

    const {password, ...safeUser} = user

    return this.generateUserTokenResponse(safeUser, 'User LoggedIn Successfully');
  }

  async verifyEmail(token: string){

     let payload:TokenPayload;
     try {
     payload = this.jwtService.verifyAccessToken(token);
     } catch (error) {
      throw new BadRequestException('Invalid or expired verification token.');
     }
      await this.userService.updateEmailVerifiedStatus(payload.id, true)
     return {
      success: true,
      message: 'Email verified successfully! You can now log in.',
    };
  }

  async forgetPassword(){

    
  }

  async resetPassword(){

  }

  private generateUserTokenResponse(
    user: Omit<User, 'password'>,
    message: string,
  ) {
    const payload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.createAccessToken(payload);
    const refreshToken = this.jwtService.createRefreshToken(payload);

    return {
      success: true,
      message: message,
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
