import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DocService } from './doc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './model/doc.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Doc])],
  controllers: [DocController],
  providers: [DocService],
})
export class DocModule {}
