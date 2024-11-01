import { Module } from '@nestjs/common';
import { PostsService } from '@/posts/posts.service';
import { PostsController } from '@/posts/posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '@/posts/posts.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    ConfigModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
