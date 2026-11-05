import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'prisma/generated/prisma/client';
import { UserService } from 'src/user/user.service';
import { BcryptService } from 'src/utils/bcryptService';
import { JwtService, TokenPayload } from 'src/utils/jwtService';
import { RegisterDto } from './dto/registerDto';
import { UserEventsService } from 'src/events/userEventsService';

@Injectable()
export class AuthService {

      
      constructor(private readonly userService:UserService, private readonly jwtService:JwtService, private readonly bcryptService: BcryptService, private readonly userEventService:UserEventsService){}

      async signUp(registerDetails: RegisterDto){
      const normalizedEmail = registerDetails.email.toLowerCase()
      const existingUser = await this.userService.findUserByEmail(normalizedEmail)

      if(existingUser){
            throw new ConflictException('A user with this email address already exists.')
      }

      const hashedPassword = await this.bcryptService.hashPassword(registerDetails.password)

      const newlyCreatedUser = await this.userService.registerUser({...registerDetails, email: normalizedEmail, password: hashedPassword})

      const verifyToken = this.jwtService.createAccessToken({id: newlyCreatedUser.id, name: newlyCreatedUser.name, email: newlyCreatedUser.email, role: newlyCreatedUser.role})


      // emitting user registration event to send email to verify email

      this.userEventService.emitUserRegistered(newlyCreatedUser, verifyToken)

      return {
            success: true,
            message: 'User registered successfully. Please check your email to verify.'
      }


        



      }

      async login(){

      }

      async validateGoogleUser(googleUser: {  email: string,
             isemailverified: boolean,
             name: string,
             profileImg: string}){
         
          const normalizedEmail = googleUser.email.toLowerCase()
          const user = await this.userService.findUserByEmail(normalizedEmail)

          if(!user){
             return
          }

          const {password, ...safeUser} = user

          return this.generateUserTokenResponse(safeUser, 'User LoggedIn Successfully')
      }











      private generateUserTokenResponse(user: Omit<User, 'password'>, message: string){

            const payload: TokenPayload = {
                   id: user.id,
                   name: user.name,
                   email: user.email,
                   role: user.role
            }

            const accessToken = this.jwtService.createAccessToken(payload)
            const refreshToken = this.jwtService.createRefreshToken(payload)

            return {
                  success: true,
                  message: message,
                  user: user,
                  accessToken: accessToken,
                  refreshToken: refreshToken
            }
      }

}
