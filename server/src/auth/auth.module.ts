import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCommonModule } from 'src/auth-shared-module/auth-shared-module.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [AuthCommonModule,EventsModule]
})
export class AuthModule {}
