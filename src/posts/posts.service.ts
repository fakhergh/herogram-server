import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@/posts/posts.schema';
import { Model, Types } from 'mongoose';
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
    return this.postModel.find({ userId }).sort({ position: 1 });
  }

  getPostByFileName(filename: string): Promise<Post> {
    return this.postModel.findOne({ filename });
  }

  incrementViewer(postId: Types.ObjectId): Promise<Post> {
    const filter = { _id: postId };
    const update = { $inc: { viewsCount: 1 } };

    return this.postModel.findOneAndUpdate(filter, update);
  }

  async sortPosts(ids: Array<string | Types.ObjectId>) {
    const operations = ids.map((id: string, position: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position } },
      },
    }));

    return await this.postModel.bulkWrite(operations);
  }
}
