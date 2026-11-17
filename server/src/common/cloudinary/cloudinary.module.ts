import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinaryService";
import { CloudinaryProvider } from "./cloudinaryProvider";

@Module({
     providers: [CloudinaryProvider, CloudinaryService],
     exports: [CloudinaryService]
})

export class CloudinaryModule{}
