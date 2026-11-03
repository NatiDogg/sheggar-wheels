import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

      
      constructor(private readonly userService:UserService){}

      async signUp(){

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
            
          }
      }

}
