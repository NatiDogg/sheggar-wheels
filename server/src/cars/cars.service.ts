import { Injectable, InternalServerErrorException,Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/createCarDto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinaryService';
import { UploadApiResponse } from 'cloudinary';
import { CarEventsService } from 'src/events/carEventsService';
import { UpdateCarDto } from './dto/updateCarDto';
import { QueryCarDto } from './dto/queryCarDto';

@Injectable()
export class CarsService {

          private logger = new Logger(CarsService.name)
       
        constructor(private prisma:PrismaService, private readonly cloudinaryService:CloudinaryService, private readonly carEventsService:CarEventsService){}

        async createCar(carDetails: CreateCarDto, carImgFile:Express.Multer.File, ownerId: string){

                let uploadedImage: UploadApiResponse | undefined;
                let carCreated = false
             try {
                uploadedImage = await this.cloudinaryService.uploadImage(carImgFile);
                if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
                  throw new InternalServerErrorException('Failed to upload car image');
                }
                const newlyRegisteredCar = await this.prisma.car.create({
                 data:{
                   ...carDetails,
                   carImg: uploadedImage.secure_url,
                   carImgPublicId: uploadedImage.public_id,
                    ownerId
                 }
                })
                carCreated = true;

                //emit car registered event to notify the admin to approve pending cars as soon as possible
                this.carEventsService.emitCarRegisteredEvent({carId: newlyRegisteredCar.id, make: newlyRegisteredCar.make, model: newlyRegisteredCar.model, year: newlyRegisteredCar.year, price: newlyRegisteredCar.price.toNumber(),createdAt: newlyRegisteredCar.createdAt})

                return {
                   success: true,
                   message: 'Car registered. Awaiting admin approval.',
                   car: newlyRegisteredCar
                }

                
             } catch (error) {
                if(!carCreated && uploadedImage?.public_id){
                   try {
                       await this.cloudinaryService.deleteImage(uploadedImage.public_id);
                    } catch (cleanupError) {
                       this.logger.warn('Failed to delete cloudinary image: '+cleanupError)
                    }
                }
                 throw error
             }

         

        }

        async getCars(query:QueryCarDto){
           
        }


        // TODO: filter by status / role permissions
        async getCar(id:string){
            const car = await this.prisma.car.findUnique({where:{id}})

            if(!car){
               throw new NotFoundException('Car not Found!')
            }

            return {
                success: true,
                message: "Car retrieved Successfully",
                car: car
            }
        }

        async updateCar(updateCarDetails:UpdateCarDto, ownerId: string){

        }

        async deleteCar(carId:string, ownerId:string){
            
        }

        async updateCarStatus(){
           
        }
}
