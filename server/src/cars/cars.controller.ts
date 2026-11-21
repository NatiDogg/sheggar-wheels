import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/createCarDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; 
const ALLOWED_IMAGE_MIME_REGEX = /^image\/(jpeg|jpg|png|webp)$/;

@Controller('cars')
export class CarsController {

       constructor(private readonly carsService:CarsService){}


       @Roles(Role.USER)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Post('register')
       @UseInterceptors(FileInterceptor('carImg'))
       async registerCar(@Body() carDetails:CreateCarDto, @UploadedFile(new ParseFilePipe({
               validators:[
                      new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_BYTES }),
                      new FileTypeValidator({ fileType: ALLOWED_IMAGE_MIME_REGEX }),
               ],
               fileIsRequired: true
       })) image: Express.Multer.File, @CurrentUser() user:Omit<User,'password'>){   
              
         return await this.carsService.registerCar(carDetails, image, user.id)
       }
}
