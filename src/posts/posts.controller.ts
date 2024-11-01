import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  UseGuards,
  Patch,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from '@/posts/posts.service';
import { CreatePostDto, UpdatePostPositionDto } from '@/posts/posts.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as UUID } from 'uuid';
import { extname } from 'path';
import { RequestUser } from '@/common/types/auth';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads', // Set the upload destination folder
    filename: (_, file, callback) => {
      // Generate a unique file name
      const uniqueFilename = `${UUID()}${extname(file.originalname)}`;
      callback(null, uniqueFilename);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Check if the uploaded file is an image or a video
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if (isImage || isVideo) {
      callback(null, true); // Accept file
    } else {
      callback(
        new BadRequestException('Only image and video files are allowed!'),
        false,
      ); // Reject file
    }
  },
};

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object' } })
  @UseInterceptors(FileInterceptor('media', multerConfig))
  create(
    @Req() req: RequestUser,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Media field is required');

    return this.postsService.create({
      userId: req.user._id,
      filename: file.filename,
      path: file.path,
      tags: createPostDto.tags,
      mimetype: file.mimetype,
      size: file.size,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPosts(@Req() req: RequestUser) {
    return this.postsService.getPostsByUserId(req.user._id);
  }

  @Patch(':postId/position')
  @UseGuards(JwtAuthGuard)
  async updatePostPosition(
    @Req() req: RequestUser,
    @Param('postId') postId: string,
    @Body() updatePostPositionDto: UpdatePostPositionDto,
  ) {
    const post = await this.postsService.getPost(postId, req.user._id);

    if (!post) throw new NotFoundException('Post not found');

    return this.postsService.updatePosition(
      post._id,
      updatePostPositionDto.position,
    );
  }
}
