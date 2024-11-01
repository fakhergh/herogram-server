import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { hashAsync } from '@/utils/bcrypt.util';

@Schema({ collection: 'users', timestamps: true })
export class User extends Document<Types.ObjectId> {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, lowercase: true })
  email: string;

  @Prop()
  password: string;

  createdAt: Date;

  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew && this.isModified('password')) {
    this.password = await hashAsync(this.password);
  }

  next();
});
