import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/createCarDto';

@Injectable()
export class CarsService {

       
        constructor(private prisma:PrismaService){}

        async registerCar(carDetails: CreateCarDto, carImg:Buffer, ownerId: string){

        }

        async getCars(){

        }

        async getCar(){

        }

        async updateCar(){

        }

        async deleteCar(){
            
        }
}
