import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from 'src/doc/model/doc.entity';
import { Guess } from './model/guess.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guess, Doc])],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
