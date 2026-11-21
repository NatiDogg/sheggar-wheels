import { Injectable, InternalServerErrorException,Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/createCarDto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinaryService';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CarsService {

          private logger = new Logger(CarsService.name)
       
        constructor(private prisma:PrismaService, private readonly cloudinaryService:CloudinaryService){}

        async registerCar(carDetails: CreateCarDto, carImgFile:Express.Multer.File, ownerId: string){

                let uploadedImage: UploadApiResponse | undefined;
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

                //emit car registered event to notify the admin to approve pending cars as soon as possible

                return {
                   success: true,
                   message: 'Car registered. Awaiting admin approval.',
                   car: newlyRegisteredCar
                }

                
             } catch (error) {
                if(uploadedImage?.public_id){
                   try {
                       await this.cloudinaryService.deleteImage(uploadedImage.public_id);
                    } catch (cleanupError) {
                       this.logger.warn('Failed to delete cloudinary image: '+cleanupError)
                    }
                }
                 throw error
             }

         

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
