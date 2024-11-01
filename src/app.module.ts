import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { SessionsModule } from '@/sessions/sessions.module';
import { PostsModule } from '@/posts/posts.module';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from '@/auth/auth.module';
import { MediaModule } from '@/media/media.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    DatabaseModule,
    UsersModule,
    SessionsModule,
    PostsModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
