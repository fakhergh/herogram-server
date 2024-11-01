import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  media: Express.Multer.File;

  @IsOptional()
  @IsArray()
  tags: string[];
}

export class UpdatePostPositionDto {
  @IsNumber()
  position: number;
}
