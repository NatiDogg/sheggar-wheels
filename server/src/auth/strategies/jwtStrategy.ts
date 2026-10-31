import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from '@nestjs/passport'
import {Strategy,ExtractJwt} from 'passport-jwt'
import { PrismaService } from "src/prisma/prisma.service";
import { TokenPayload } from "src/utils/jwtService";
import { envConfig } from "src/utils/zodEnvValidator";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

        constructor(private readonly configService:ConfigService<envConfig>, private prisma:PrismaService){

             super({
                ignoreExpiration: false,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET_KEY')
             })
        }



    async validate(payload: TokenPayload ) {
         const user = await this.prisma.user.findUnique({where: {id: payload.id}})

         if(!user){
            throw new UnauthorizedException("User Not Found!")
         }

         return user
    }
}