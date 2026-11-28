import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/createCarDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuthGuard';
import { RolesGuard } from 'src/auth/guards/rolesGuard';
import { Roles } from 'src/auth/decorators/rolesDecorator';
import { Role } from 'prisma/generated/prisma/enums';
import { CurrentUser } from 'src/auth/decorators/currentUserDecorator';
import { User } from 'prisma/generated/prisma/client';
import { UpdateCarDto } from './dto/updateCarDto';
import { QueryCarDto } from './dto/queryCarDto';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQueryDto';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; 
const ALLOWED_IMAGE_MIME_REGEX = /^image\/(jpeg|jpg|png|webp)$/;

@Controller('cars')
export class CarsController {

       constructor(private readonly carsService:CarsService){}


       @Roles(Role.USER)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Post('register')
       @UseInterceptors(FileInterceptor('carImg'))
       async createCar(@Body() carDetails:CreateCarDto, @UploadedFile(new ParseFilePipe({
               validators:[
                      new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_BYTES }),
                      new FileTypeValidator({ fileType: ALLOWED_IMAGE_MIME_REGEX }),
               ],
               fileIsRequired: true
       })) imagefile: Express.Multer.File, @CurrentUser() user:Omit<User,'password'>){   
              
         return await this.carsService.createCar(carDetails, imagefile, user.id)
       }


       @Get('')
       async getCars(@Query() query: QueryCarDto, @Query() pagination:PaginationQueryDto){


              return await this.carsService.getCars(query,pagination)
                


       }

       @Get('')
       async getMyCar(){

       }

       @Get('')
       async getCar(){
               
       }

       @Roles(Role.USER)
       @UseGuards(JwtAuthGuard,RolesGuard)
       @Patch('update/:id')
       @UseInterceptors(FileInterceptor('carImg'))
       async updateCar(@Param('id',ParseUUIDPipe) carId: string,@Body() updateDetails:UpdateCarDto,@CurrentUser() user: Omit<User, 'password'>, @UploadedFile(new ParseFilePipe({
               validators:[
                      new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE_BYTES }),
                      new FileTypeValidator({ fileType: ALLOWED_IMAGE_MIME_REGEX }),
               ],
               fileIsRequired: false
       })) imageFile?:Express.Multer.File, ){
            return await this.carsService.updateCar(updateDetails, user.id, carId, imageFile)
       }


       @Patch('')
       async updateCarStatus(){

       }

       @Delete('')
       async deleteCar(){

       }
}
