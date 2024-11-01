import { Controller, Get, Param, Res } from '@nestjs/common';
import { PostsService } from '@/posts/posts.service';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly postsService: PostsService) {}

  @Get('public/:filename')
  async findByUniqueNameForPublic(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const post = await this.postsService.getPostByFileName(filename);

    const filePath = path.join(__dirname, '../..', post.path); // Adjust the path as necessary

    const fileStream = fs.createReadStream(filePath);

    await this.postsService.incrementViewer(post._id);

    res.setHeader('Content-Type', post.mimetype);

    fileStream.pipe(res);
    fileStream.on('error', () => {
      res.status(404).send('File not found');
    });
  }

  @Get(':filename')
  async findByUniqueName(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const post = await this.postsService.getPostByFileName(filename);

    const filePath = path.join(__dirname, '../..', post.path); // Adjust the path as necessary

    const fileStream = fs.createReadStream(filePath);

    res.setHeader('Content-Type', post.mimetype);

    fileStream.pipe(res);
    fileStream.on('error', () => {
      res.status(404).send('File not found');
    });
  }
}
