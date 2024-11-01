import { Injectable } from '@nestjs/common';
import { Session } from '@/sessions/sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async getSession(userId: Types.ObjectId, accessToken: string) {
    return this.sessionModel.findOne({ userId, token: accessToken });
  }

  async getSessionByAccessToken(token: string) {
    return this.sessionModel.findOne({ token });
  }

  async createSession(userId: Types.ObjectId, token: string): Promise<Session> {
    return new this.sessionModel({ userId, token }).save();
  }

  async deleteSession(token: string) {
    return this.sessionModel.deleteOne({ token });
  }
}
