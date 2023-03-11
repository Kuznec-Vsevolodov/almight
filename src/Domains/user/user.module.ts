import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { FileService } from '../file/file.service';
import { Repository } from 'typeorm';
import { PhotoService } from '../photo/photo.service';

@Module({
  providers: [UserService, FileService, Repository, PhotoService],
  controllers: [UserController]
})
export class UserModule { }