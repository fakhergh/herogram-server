import { User } from '@/users/users.schema';

export interface RequestUser extends Request {
  user: User;
}

export interface JwtPayload {
  _id: string;
  exp?: number;
  iat?: number;
}
