import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-google-oauth20'
import {env} from '../../utils/zodEnvValidator'
@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){

     constructor(){
        super({
             clientID: env.GOOGLE_CLIENT_ID,
             clientSecret: env.GOOGLE_CLIENT_SECRET,
             callbackURL: env.callbackURL,
             scope: ['email', 'profile']
        })
     }

      validate(...args: any[]) {
          
      }

}