import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthCommonModule } from './auth-shared-module/auth-shared-module.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './utils/zodEnvValidator';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
@Module({
  imports: [

    ConfigModule.forRoot({
       isGlobal: true,
       validate
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ttl: 60000, limit: 20}]
    }),
    PrismaModule, AuthModule, AuthCommonModule, UserModule],
  controllers: [AppController],
  providers: [AppService, {
     provide: APP_GUARD,
     useClass: ThrottlerGuard
  }],
})
export class AppModule {}
