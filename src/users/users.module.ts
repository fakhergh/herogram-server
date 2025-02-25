import { Module } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from '@/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
