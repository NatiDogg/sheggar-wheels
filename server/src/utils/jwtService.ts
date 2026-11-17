import { Injectable,UnauthorizedException } from "@nestjs/common";
import { Role } from "prisma/generated/prisma/enums";

import { env } from "./zodEnvValidator";
import jwt from 'jsonwebtoken'
export interface TokenPayload{
      id: string;
      name: string;
      email: string;
      role: Role
}
export interface EmailVerificationPayload {
  id: string;
  email: string;
  purpose: 'email-verification';
}
@Injectable()
export class JwtService{

       
    createAccessToken(userPayload:TokenPayload): string{
        return jwt.sign(userPayload, env.JWT_ACCESS_TOKEN_SECRET_KEY, {expiresIn:'15m'})
    }
    createRefreshToken(userPayload:TokenPayload): string{
          return jwt.sign(userPayload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {expiresIn:'7d'})
    }
    createEmailVerificationToken(userPayload: EmailVerificationPayload): string{
         
        return jwt.sign(userPayload, env.JWT_EMAIL_VERIFICATION_SECRET_KEY, {expiresIn: "15m"})
    }
    verifyAccessToken(token: string){
        return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY) as TokenPayload
    }
    verifyRefreshtoken(token:string){
         return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET_KEY) as TokenPayload
    }
    verifyEmailVerificationToken(token: string): EmailVerificationPayload {
    const payload = jwt.verify(
        token,
        env.JWT_EMAIL_VERIFICATION_SECRET_KEY
    );

    if (
        typeof payload === 'string' ||
        !payload ||
        typeof payload.id !== 'string' ||
        typeof payload.email !== 'string' ||
        payload.purpose !== 'email-verification'
    ) {
        throw new UnauthorizedException('Invalid verification token.');
    }

    return payload as EmailVerificationPayload;
}

}