import { Inject, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import {Multer} from "multer"
import * as streamifier from 'streamifier'
@Injectable()

export class CloudinaryService{
     constructor(@Inject('CLOUDINARY') private readonly cloudinary:any){}

     uploadImage(file: Express.Multer.File):Promise<UploadApiResponse>{
        
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