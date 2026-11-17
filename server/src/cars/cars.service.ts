import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarsService {

       
        constructor(private prisma:PrismaService){}

        async createCar(){

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
