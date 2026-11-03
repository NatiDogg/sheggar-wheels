import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-google-oauth20'
import {env} from '../../utils/zodEnvValidator'
@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy){

     constructor(){
        super({
             clientID: env.GOOGLE_CLIENT_ID,
             clientSecret: env.GOOGLE_CLIENT_SECRET,
             callbackURL: env.callbackURL || 'http://localhost:5000/api/auth/google/callback',
             scope: ['email', 'profile']
        })
     }

      validate(accessToken: string, refreshToken: string, profile:any) {

          const {emails, } = profile

           


      }

}