import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  providers: [CarsService],
  controllers: [CarsController],
  imports:[CloudinaryModule]
})
export class CarsModule {}
