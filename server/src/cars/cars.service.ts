import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
 
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarDto } from './dto/createCarDto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinaryService';
import { UploadApiResponse } from 'cloudinary';
import { CarEventsService } from 'src/events/carEventsService';
import { UpdateCarDto } from './dto/updateCarDto';
import { QueryCarDto } from './dto/queryCarDto';
import { BookingStatus, Car, CarStatus, Prisma, Role } from 'prisma/generated/prisma/client';

import { PaginationQueryDto } from 'src/common/pagination/dto/paginationQueryDto';
import { PaginationResponse } from 'src/common/pagination/interface/paginationResponseInterface';

const carSelect = {
  id: true,
  make: true,
  model: true,
  description: true,
  year: true,
  price: true,
  carImg: true,
  createdAt: true,
  seatingCapacity: true,
  owner: {
    select: {
      name: true,
      email: true,
      profileImg: true,
    },
  },
} satisfies Prisma.CarSelect;

export type CarListItem = Prisma.CarGetPayload<{
  select: typeof carSelect;
}>;
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
        data: newlyRegisteredCar,
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

  //TO-DO: get feedbacks  and let public users see the rating for the car or booking
  async getCars(
    query: QueryCarDto,
    pagination: PaginationQueryDto,
  ): Promise<PaginationResponse<CarListItem>> {
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

        select: {
          id: true,
          make: true,
          description: true,
          year: true,
          price: true,
          carImg: true,
          createdAt: true,
          owner: { select: { name: true, email: true, profileImg: true } },
          seatingCapacity: true,
          model: true,
          updatedAt: true,
          status: true,
        },
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

  async getMyCars(ownerId: string) {
    const cars = await this.prisma.car.findMany({
      where: { ownerId },
    });

    return {
      success: true,
      message: 'Cars Retrieved Successfully',
      data: cars,
    };
  }

  async getCar(carId: string, user: { id: string; role: Role }) {
    const whereCondition: Prisma.CarWhereUniqueInput =
      user.role === Role.ADMIN
        ? { id: carId }
        : { id: carId, ownerId: user.id };

    const car = await this.prisma.car.findUnique({
      where: whereCondition,
    });

    if (!car) {
      throw new NotFoundException('Car not found!');
    }

    return {
      success: true,
      message: 'Car retrieved successfully',
      data: car,
    };
  }

 async updateCar(
  updateCarDetails: UpdateCarDto,
  ownerId: string,
  carId: string,
  carImgFile?: Express.Multer.File,
) {
  const hasDetails = Object.keys(updateCarDetails).length > 0;
  if (!hasDetails && !carImgFile) {
    throw new BadRequestException(
      'Provide at least one field or a new car image to update',
    );
  }

  const activeStatuses: BookingStatus[] = ['PENDING', 'APPROVED'];


  const car = await this.prisma.car.findUnique({
    where: { id: carId },
    select: {
      ownerId: true,
      carImgPublicId: true,
      bookings: {
        where: { status: { in: activeStatuses } },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!car) {
    throw new NotFoundException('Car Not Found!');
  }

  if (car.ownerId !== ownerId) {
    throw new ForbiddenException(
      'You are not authorized to update someone else’s car',
    );
  }

  if (car.bookings.length > 0) {
    throw new BadRequestException('Cannot update car with active bookings');
  }

  const oldCarCloudinaryPublicId = car.carImgPublicId;
  let uploadedImage: UploadApiResponse | undefined;
  let updatedCar: Car;

  try {
    
    if (carImgFile) {
      uploadedImage = await this.cloudinaryService.uploadImage(carImgFile);
    }

    
    updatedCar = await this.prisma.car.update({
      where: {
        id: carId,
        ownerId,
        bookings: { none: { status: { in: activeStatuses } } },
      },
      data: {
        ...updateCarDetails,
        ...(uploadedImage && {
          carImg: uploadedImage.secure_url,
          carImgPublicId: uploadedImage.public_id,
        }),
        status: CarStatus.PENDING,
      },
    });
  } catch (error) {

    if (uploadedImage?.public_id) {
      try {
        await this.cloudinaryService.deleteImage(uploadedImage.public_id);
      } catch (cleanupError) {
        this.logger.warn(
          `Failed to delete uploaded Cloudinary image (${uploadedImage.public_id}): ${cleanupError}`,
        );
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new ConflictException(
        'Car could not be updated. It may have changed or received a booking.',
      );
    }

    throw error;
  }


  if (uploadedImage && oldCarCloudinaryPublicId) {
    try {
      await this.cloudinaryService.deleteImage(oldCarCloudinaryPublicId);
    } catch (cleanupError) {
      this.logger.warn(
        `Failed to delete old Cloudinary image (${oldCarCloudinaryPublicId}): ${cleanupError}`,
      );
    }
  }


  //emit event for the admin to let know a specific car has been updated here

  return {
    success: true,
    message: 'Car Updated Successfully',
    data: updatedCar,
  };
}

  async deleteCar(carId: string, ownerId: string) {

      const activeBookings:BookingStatus[] = ['PENDING','APPROVED','IN_PROGRESS']

    
     
      try {
        
      } catch (error) {
        
      }



  }

  async updateCarStatus() {}
}
