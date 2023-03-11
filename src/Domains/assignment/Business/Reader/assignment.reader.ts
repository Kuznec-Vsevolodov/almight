import { Injectable } from '@nestjs/common';
import { AssignmentRepository } from '../../Infrastructure/Repository/assignment.repository';

@Injectable()
export class AssignmentReader {

    constructor(
        private assignmentRepository: AssignmentRepository
    ) { }

    async getById(id) {
        return await this.assignmentRepository.getAssignmentById(id);
    }

    async getByClientId(user_id) {
        return await this.assignmentRepository.getAssignmentByUserId(user_id);
    }

}