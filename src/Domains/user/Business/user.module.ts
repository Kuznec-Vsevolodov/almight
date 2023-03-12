import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from '../Presentation/HTTP/user.controller';
import { FileService } from '../../file/Busines/file.service';
import { Repository } from 'typeorm';
import { PhotoService } from '../../photo/Busines/photo.service';
import { UserWriter } from './Writer/user.writer';
import { UserReader } from './Reader/user.reader';
import { UserRepository } from '../Infrastructure/Repository/user.repository';

@Module({
  providers: [UserService,UserWriter, UserReader, UserRepository],
  controllers: [UserController]
})
export class UserModule { }
