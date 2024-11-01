import { Module } from '@nestjs/common';
import { SessionsService } from '@/sessions/sessions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '@/sessions/sessions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
