import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Provider } from 'prisma/generated/prisma/client';


import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {


         constructor(private prisma:PrismaService){}




         async registerUser(userDetails: {name: string, email: string, password?: string, profileImg?: string}, isVerifed?: boolean, provider?: Provider){

              try {

                return await this.prisma.user.create({data: {
                   name: userDetails.name,
                   email: userDetails.email,
                   password: userDetails.password ?? null,
                   profileImg: userDetails.profileImg ?? null,
                   emailVerified: isVerifed ?? false,
                   provider: provider ?? 'LOCAL'
                }, omit: {password: true}})
                
              } catch (error) {
                if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
                    throw new ConflictException('Email already in use')
                }

                throw error
              }
         }


         async findUserByEmail(email: string){
          
             return await this.prisma.user.findUnique({where: {email}})
         }

         async updateEmailVerifiedStatus(id: string, isVerifed: boolean){
             return await this.prisma.user.update({
                  where: { id },
                 data: { emailVerified: isVerifed },
             });
         }

         
}
