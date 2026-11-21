import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import {Multer} from "multer"
import * as streamifier from 'streamifier'


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
const ALLOWED_MIMETYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);



@Injectable()

export class CloudinaryService{
     constructor(@Inject('CLOUDINARY') private readonly cloudinary:any){}


     private validateImage(file:Express.Multer.File){

         if(!file){
           throw new BadRequestException('No image file provided');
         }

         if(!ALLOWED_MIMETYPES.has(file.mimetype)){
            throw new BadRequestException(
            `Unsupported image type (${file.mimetype}). Allowed types: JPEG, PNG, WebP`,
            );
         }

         if(file.size > MAX_FILE_SIZE){
             throw new BadRequestException(
             `Image size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)} MB limit`,
           );
         }

         

     }

     uploadImage(file: Express.Multer.File):Promise<UploadApiResponse>{
         this.validateImage(file)
         return new Promise<UploadApiResponse>((reslove,reject)=>{
           
            const uploadStream = this.cloudinary.uploader.upload_stream({
                folder: 'sheggerwheels_project',
                 resource_type: 'image',

                 
            }, (error : UploadApiErrorResponse, result: UploadApiResponse)=>{
                if(error) reject(error)
                  reslove(result)
            })
          
               streamifier.createReadStream(file.buffer).pipe(uploadStream);

         })

     }

     async deleteImage(publicId: string): Promise<any>{
      return this.cloudinary.uploader.destroy(publicId);
     }


}