import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'
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

      validate(accessToken: string, refreshToken: string, profile:any, done: VerifyCallback) {

         const {name, emails, photos} = profile

         const user = {
             email: emails[0].value,
             isemailverified: emails[0].verified,
             name: `${name.givenName} ${name.familyName}`,
             profileImg: photos[0].value
         }

         done(null,user)


      }

}