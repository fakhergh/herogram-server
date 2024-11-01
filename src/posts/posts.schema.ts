import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ collection: 'posts', timestamps: true })
export class Post extends Document<Types.ObjectId> {
  @ApiProperty({ type: 'string' })
  _id: Types.ObjectId;

  @ApiProperty({ type: 'string' })
  @Prop({ required: true })
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  path: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  filename: string;

  @ApiProperty()
  @Prop({ required: true })
  mimetype: string;

  @ApiProperty()
  @Prop({ required: true })
  size: number;

  @ApiProperty()
  @Prop({ required: true })
  position: number;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty()
  @Prop({ default: 0 })
  viewsCount: number;

  @ApiProperty()
  @Prop({ required: true })
  url: string;

  @ApiProperty()
  @Prop({ required: true })
  sharableUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type PostDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
