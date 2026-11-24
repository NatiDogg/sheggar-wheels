import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Search,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/createCarDto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinaryService';
import { UploadApiResponse } from 'cloudinary';
import { CarEventsService } from 'src/events/carEventsService';
import { UpdateCarDto } from './dto/updateCarDto';
import { QueryCarDto } from './dto/queryCarDto';
import { Car, CarStatus, Prisma } from 'prisma/generated/prisma/client';
import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQueryDto';
import { PaginationResponse } from 'src/common/pagination/interface/paginationResponseInterface';

@Injectable()
export class CarsService {
  private logger = new Logger(CarsService.name);

  constructor(
    private prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly carEventsService: CarEventsService,
  ) {}

  async createCar(
    carDetails: CreateCarDto,
    carImgFile: Express.Multer.File,
    ownerId: string,
  ) {
    let uploadedImage: UploadApiResponse | undefined;
    let carCreated = false;
    try {
      uploadedImage = await this.cloudinaryService.uploadImage(carImgFile);
      if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
        throw new InternalServerErrorException('Failed to upload car image');
      }
      const newlyRegisteredCar = await this.prisma.car.create({
        data: {
          ...carDetails,
          carImg: uploadedImage.secure_url,
          carImgPublicId: uploadedImage.public_id,
          ownerId,
        },
      });
      carCreated = true;

      //emit car registered event to notify the admin to approve pending cars as soon as possible
      this.carEventsService.emitCarRegisteredEvent({
        carId: newlyRegisteredCar.id,
        make: newlyRegisteredCar.make,
        model: newlyRegisteredCar.model,
        year: newlyRegisteredCar.year,
        price: newlyRegisteredCar.price.toNumber(),
        createdAt: newlyRegisteredCar.createdAt,
      });

      return {
        success: true,
        message: 'Car registered. Awaiting admin approval.',
        car: newlyRegisteredCar,
      };
    } catch (error) {
      if (!carCreated && uploadedImage?.public_id) {
        try {
          await this.cloudinaryService.deleteImage(uploadedImage.public_id);
        } catch (cleanupError) {
          this.logger.warn(
            'Failed to delete cloudinary image: ' + cleanupError,
          );
        }
      }
      throw error;
    }
  }

  async getCars(
    query: QueryCarDto,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResponse<Car>> {
    const { search, minPrice, maxPrice, minYear, maxYear, minSeatingCapacity } =
      query;
    const { limit = 10, page = 1 } = pagination;

    const skip = (page - 1) * limit;

    const queryCondition: Prisma.CarWhereInput = {
      ...(search && {
        OR: [
          { make: { contains: search, mode: 'insensitive' as const } },
          { model: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
      ...((minYear !== undefined || maxYear !== undefined) && {
        year: {
          ...(minYear !== undefined && { gte: minYear }),
          ...(maxYear !== undefined && { lte: maxYear }),
        },
      }),
      ...(minSeatingCapacity !== undefined && {
        seatingCapacity: { gte: minSeatingCapacity },
      }),
    };

    const whereCondition: Prisma.CarWhereInput = {
      ...queryCondition,
      status: CarStatus.APPROVED,
    };

    const [cars, totalItems] = await Promise.all([
      this.prisma.car.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.car.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      success: true,
      message: 'Cars Retrieved Successfully',
      data: cars,
      metaData: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getMyCars() {}

  // TODO: filter by status / role permissions
  async getCar(id: string) {
    const car = await this.prisma.car.findUnique({ where: { id } });

    if (!car) {
      throw new NotFoundException('Car not Found!');
    }

    return {
      success: true,
      message: 'Car retrieved Successfully',
      car: car,
    };
  }

  async updateCar(updateCarDetails: UpdateCarDto, ownerId: string) {}

  async deleteCar(carId: string, ownerId: string) {}

  async updateCarStatus() {}
}
