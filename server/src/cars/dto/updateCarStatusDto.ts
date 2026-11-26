import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CarStatus } from 'prisma/generated/prisma/enums';

export const ReviewableCarStatus = {
  APPROVED: CarStatus.APPROVED,
  REJECTED: CarStatus.REJECTED,
} as const;

export type ReviewableCarStatus =
  (typeof ReviewableCarStatus)[keyof typeof ReviewableCarStatus];

const allowedStatuses = Object.values(ReviewableCarStatus);

export class UpdateCarStatusDto {
  @ApiProperty({
    enum: allowedStatuses,
    enumName: 'ReviewableCarStatus',
    example: CarStatus.APPROVED,
    description: 'Approval decision for a pending car listing',
  })
  @IsEnum(ReviewableCarStatus, {
    message: `Status must be one of: ${allowedStatuses.join(', ')}`,
  })
  status!: ReviewableCarStatus;
}