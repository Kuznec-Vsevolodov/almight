import { Injectable } from '@nestjs/common';
import { FileService, FileType } from 'src/Domains/file/Busines/file.service';
import { CreateAssignmentDto } from '../../Presentation/dto/create-assignment.dto';
import { AssignmentDto } from '../Dto/assignment.dto';
import { Service } from 'src/Domains/service/Infrastructure/Models/service.entity';
import { AssignmentStatus } from '../../Infrastructure/Models/assignment.entity';
import { AssignmentRepository } from '../../Infrastructure/Repository/assignment.repository';
import { Doc } from 'src/Domains/assignment/Infrastructure/Models/doc.entity';
import { UpdateStatusDto } from '../../Presentation/dto/update-status.dto';
import { ContractorService } from 'src/Domains/contractor/Business/contractor.service';
import { UserService } from 'src/Domains/user/Business/user.service';
import { ServiceService } from 'src/Domains/service/Business/service.service';

@Injectable()
export class AssignmentWriter {

    constructor(
        private fileService: FileService,
        private assignmentRepository: AssignmentRepository,
        private contractorService: ContractorService,
        private userService: UserService,
        private serviceService: ServiceService,
    ) { }

    public async create(presentationDto: CreateAssignmentDto, docs) {
        const assignment = new AssignmentDto();

        assignment.client = await this.userService.getById(presentationDto.client)
        assignment.contractor = await this.contractorService.getById(presentationDto.contractor)
        assignment.service = await this.serviceService.getById(presentationDto.service)
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