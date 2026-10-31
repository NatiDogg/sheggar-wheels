import { Injectable } from "@nestjs/common";
import { Role } from "prisma/generated/prisma/enums";

import { env } from "./zodEnvValidator";
import jwt from 'jsonwebtoken'
export interface TokenPayload{
      id: string;
      name: string;
      email: string;
      role: Role
}
@Injectable()
export class JwtService{

       
    createAccessToken(userPayload:TokenPayload): string{
        return jwt.sign(userPayload, env.JWT_ACCESS_TOKEN_SECRET_KEY, {expiresIn:'15m'})
    }
    createRefreshToken(userPayload:TokenPayload): string{
          return jwt.sign(userPayload, env.JWT_REFRESH_TOKEN_SECRET_KEY, {expiresIn:'15m'})
    }
    verifyAccessToken(token: string){
        return jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET_KEY) as TokenPayload
    }
    verifyRefreshtoken(token:string){
         return jwt.verify(token, env.JWT_REFRESH_TOKEN_SECRET_KEY) as TokenPayload
    }

}