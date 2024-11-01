import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@/posts/posts.schema';
import { Model, Types } from 'mongoose';
import * as process from 'node:process';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/config/config.type';

export interface CreatePostData {
  userId: Types.ObjectId;
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  tags: string[];
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPostData: CreatePostData): Promise<Post> {
    const highPositionPost = await this.postModel
      .findOne({ userId: createPostData.userId })
      .sort({ position: -1 });

    const position =
      typeof highPositionPost?.position === 'number'
        ? highPositionPost.position + 1
        : 0;

    const config =
      this.configService.get<EnvironmentVariables['server']>('server');

    const url = `${config.hostname}/api/media/${createPostData.filename}`;
    const sharableUrl = `${config.hostname}/api/media/public/${createPostData.filename}`;

    return new this.postModel({
      ...createPostData,
      position,
      url,
      sharableUrl,
    }).save();
  }

  getPost(
    id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<Post> {
    return this.postModel.findOne({ _id: id, userId });
  }

  getPostsByUserId(userId: string | Types.ObjectId): Promise<Post[]> {
    return this.postModel.find({ userId }).sort({ position: -1 });
  }

  getPostByFileName(filename: string): Promise<Post> {
    return this.postModel.findOne({ filename });
  }

  incrementViewer(postId: Types.ObjectId): Promise<Post> {
    const filter = { _id: postId };
    const update = { $inc: { viewsCount: 1 } };

    return this.postModel.findOneAndUpdate(filter, update);
  }

  async updatePosition(
    id: string | Types.ObjectId,
    newPosition: number,
  ): Promise<Post> {
    // Get the post being updated
    const postToUpdate = await this.postModel.findById(id);

    if (!postToUpdate) return null;

    const oldPosition = postToUpdate.position;

    // Adjust positions of other posts
    if (oldPosition < newPosition) {
      // If moving down the list, decrement the position of affected posts
      await this.postModel.updateMany(
        { position: { $gt: oldPosition, $lte: newPosition } },
        { $inc: { position: -1 } },
      );
    } else if (oldPosition > newPosition) {
      // If moving up the list, increment the position of affected posts
      await this.postModel.updateMany(
        { position: { $gte: newPosition, $lt: oldPosition } },
        { $inc: { position: 1 } },
      );
    }

    // Update the position of the specified post
    postToUpdate.position = newPosition;

    return postToUpdate.save();
  }
}
