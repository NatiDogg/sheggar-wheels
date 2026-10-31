import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { BcryptService } from 'src/utils/bcryptService';
import { JwtService } from 'src/utils/jwtService';

@Module({
    imports: [PassportModule.register({defaultStrategy: 'jwt'})],
    providers:[JwtService,BcryptService,JwtAuthGuard],
    exports: [JwtAuthGuard, BcryptService, JwtService,PassportModule]
})
export class AuthCommonModule {}
