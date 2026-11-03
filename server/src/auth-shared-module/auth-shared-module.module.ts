import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleAuthGuard } from 'src/auth/guards/googleAuthGuard';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { GoogleStrategy } from 'src/auth/strategies/googleStrategy';
import { BcryptService } from 'src/utils/bcryptService';
import { JwtService } from 'src/utils/jwtService';

@Module({
    imports: [PassportModule.register({defaultStrategy: 'jwt'})],
    providers:[JwtService,BcryptService,JwtAuthGuard,GoogleAuthGuard,GoogleStrategy],
    exports: [JwtAuthGuard, BcryptService, JwtService,PassportModule, GoogleAuthGuard,GoogleStrategy]
})
export class AuthCommonModule {}
