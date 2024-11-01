import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@/users/users.schema';
import { Model, Types } from 'mongoose';
import { RegisterDto } from '@/users/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  checkUserExistenceByEmail(email: string) {
    return this.userModel.exists({ email });
  }

  getUserById(id: string | Types.ObjectId) {
    return this.userModel.findById(id);
  }

  getUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  createUser(user: RegisterDto): Promise<UserDocument> {
    return this.userModel.create(user);
  }
}
