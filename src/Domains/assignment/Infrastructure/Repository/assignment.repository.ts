import { Injectable } from "@nestjs/common/decorators";
import { AssignmentDto } from "../../Business/Dto/assignment.dto";
import { Assignment } from "../Models/assignment.entity";

@Injectable()
export class AssignmentRepository{

    private assignment = Assignment.getRepository();

    async create(creationDto: AssignmentDto) {
        return Assignment.create({...creationDto}).save();
    }

    async getDataById(id){
        const currentAssignmentData = await this.assignment.findOne({
            where: { id }
        });

        return currentAssignmentData
    }

    async update(updatedData, id){
        await this.assignment.save({
            ...this.getDataById(id),
            ...updatedData
        })
    }

    async getAssignmentById(id){
        return this.assignment.createQueryBuilder("assignments")
            .leftJoinAndSelect('assignments.client', 'users')
            .leftJoinAndSelect('assignments.contractor', 'contractor')
            .leftJoinAndSelect('assignments.docs', 'docs')
            .select(['posts', 'users', 'docs', 'contractors'])
            .where('posts.id = :id', { id })
            .getOne();
    }

    async getAssignmentByUserId(id){
        return this.assignment.createQueryBuilder("assignments")
            .leftJoinAndSelect('assignments.client', 'users')
            .leftJoinAndSelect('assignments.contractor', 'contractor')
            .leftJoinAndSelect('assignments.docs', 'docs')
            .select(['posts', 'users', 'docs', 'contractors'])
            .where('users.id = :id', { id })
            .getMany();
    }

}