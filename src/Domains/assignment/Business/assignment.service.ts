import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from '../Presentation/dto/create-assignment.dto';
import { UpdateStatusDto } from '../Presentation/dto/update-status.dto';
import { AssignmentWriter } from './Writer/assignment.writer';
import { AssignmentReader } from './Reader/assignment.reader';

@Injectable()
export class AssignmentService {

    constructor(
        private readonly assignmentWriter: AssignmentWriter,
        private assignmentReader: AssignmentReader,
    ) { }

    async create(presentationDto: CreateAssignmentDto, docs){
        return await this.assignmentWriter.create(presentationDto, docs);
    } 

    async updateStatus(updateStatusDto: UpdateStatusDto, id){
        return await this.assignmentWriter.updateStatus(updateStatusDto, id);
    }

    async getById(id){
        return await this.assignmentReader.getById(id);
    }

    async getByClientId(user_id){
        return await this.assignmentReader.getByClientId(user_id);
    }
}
