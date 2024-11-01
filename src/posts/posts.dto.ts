import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  media: Express.Multer.File;

  @IsOptional()
  @IsArray()
  tags: string[];
}

export class UpdatePostPositionDto {
  @IsString({ each: true })
  ids: Array<string>;
}
