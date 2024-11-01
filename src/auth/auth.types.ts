import { ApiProperty } from '@nestjs/swagger';

class AuthResponseUser {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

export class AuthResponse {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: AuthResponseUser;
}
