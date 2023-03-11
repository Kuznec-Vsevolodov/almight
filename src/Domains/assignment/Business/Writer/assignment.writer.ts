import { Injectable } from '@nestjs/common';
import { FileService, FileType } from 'src/Domains/file/file.service';
import { CreateAssignmentDto } from '../../Presentation/dto/create-assignment.dto';
import { AssignmentDto } from '../Dto/assignment.dto';
import { Service } from 'src/entities/service.entity';
import { AssignmentStatus } from '../../Infrastructure/Models/assignment.entity';
import { AssignmentRepository } from '../../Infrastructure/Repository/assignment.repository';
import { Contractor } from 'src/entities/contractor.entity';
import { User } from 'src/entities/user.entity';
import { Doc } from 'src/entities/doc.entity';
import { UpdateStatusDto } from '../../Presentation/dto/update-status.dto';

@Injectable()
export class AssignmentWriter {

    constructor(
        private fileService: FileService,
        private assignmentRepository: AssignmentRepository
    ) { }

    public async create(presentationDto: CreateAssignmentDto, docs) {
        const assignment = new AssignmentDto();

        assignment.client = await User.findOne({ where: { id: presentationDto.client } });
        assignment.contractor = await Contractor.findOne({ where: { id: presentationDto.contractor } });
        assignment.service = await Service.findOne({where: { id: presentationDto.service }})
        assignment.description = presentationDto.description;
        assignment.location_latitude = presentationDto.location_latitude;
        assignment.location_longitude = presentationDto.location_longitude;
        assignment.contractor_location_longitude = presentationDto.contractor_location_longitude;
        assignment.contractor_location_latitude = presentationDto.contractor_location_latitude;
        assignment.status = AssignmentStatus.ACCEPTED;
        assignment.payment_amount = presentationDto.payment_amount;

        let assignment_docs: Doc[] = [];

        for (const doc of docs) {
            const saved_doc = await this.uploadDocument(doc)
            assignment_docs.push(saved_doc);
        }

        assignment.docs = assignment_docs;

        return await this.assignmentRepository.create(assignment);
    }

    async updateStatus(dto: UpdateStatusDto, id) {
        
        const status = AssignmentStatus[dto.status];

        return await this.assignmentRepository.update(status, id);
    }


    private async uploadDocument(document) {
        const doc = new Doc();

        const filePath = await this.fileService.createFile(FileType.DOCUMENT, document);

        doc.location = filePath;
        doc.name = document.originalname;
        doc.type = document.mimetype;

        return doc.save();
    }

}