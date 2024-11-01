import { Module } from '@nestjs/common';
import { MediaController } from '@/media/media.controller';
import { PostsModule } from '@/posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [MediaController],
})
export class MediaModule {}
