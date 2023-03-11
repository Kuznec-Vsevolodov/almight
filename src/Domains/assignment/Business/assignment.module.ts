import { Module } from '@nestjs/common';
import { FileService } from '../../file/file.service';
import { AssignmentController } from '../Presentation/HTTP/assignment.controller';
import { AssignmentService } from './assignment.service';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService, FileService]
})
export class AssignmentModule { }
