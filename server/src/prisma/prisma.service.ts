import { Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleDestroy, OnModuleInit {



    onModuleInit() {
        
    }
   
   
    onModuleDestroy() {
      
    }



}
