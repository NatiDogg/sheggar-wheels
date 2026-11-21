import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/createCarDto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cars')
export class CarsController {

       constructor(private readonly carsService:CarsService){}


       @Post('register')
       @UseInterceptors(FileInterceptor('carImg'))
       async registerCar(@Body() carDetails:CreateCarDto, @UploadedFile() image: Express.Multer.File){

               if(!image || image.size)
              
         return await this.carsService.registerCar()
       }
}
