import { Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'prisma/generated/prisma/client';
import { envConfig } from 'src/utils/zodEnvValidator';
import {ConfigService} from '@nestjs/config'
import {PrismaPg} from '@prisma/adapter-pg'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {

      constructor(private readonly configService:ConfigService<envConfig>){
           const adapter = new PrismaPg({connectionString: configService.getOrThrow<string>('DATABASE_URL')})

           super({adapter})
      }


    async onModuleInit() {
        
    }
   
   
    async onModuleDestroy() {
        await this.$disconnect()
    }



}
