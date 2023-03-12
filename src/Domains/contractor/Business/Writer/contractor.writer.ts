import { Injectable } from '@nestjs/common';
import { FileService, FileType } from 'src/Domains/file/file.service';
import { Service } from 'src/entities/service.entity';
import { User } from 'src/entities/user.entity';
import { ContractorDto } from '../Dto/contractor.dto';
import { CreateContractorDto } from '../../Presentation/dto/create-contractor.dto';
import { ContractorRepository } from '../../Infrastructure/Repository/contractor.repository';
import { Photo } from 'src/entities/photo.entity';

@Injectable()
export class ContractorWriter {

    constructor(
        private fileService: FileService,
        private contractorRepository: ContractorRepository
    ) { }

    public async create(presentationDto: CreateContractorDto, avatar) {
        const contractor = new ContractorDto();

        contractor.user = await User.findOne({ where: { id: presentationDto.user} });
        contractor.name = presentationDto.name;
        contractor.address = presentationDto.address;
        contractor.email = presentationDto.email;
        contractor.phone_number = presentationDto.phone_number;
        contractor.average_rating = 0;
        contractor.service = await Service.findOne({ where: { id: presentationDto.service} });
        contractor.avatar = await this.makeUserAvatar(avatar);

        return await this.contractorRepository.create(contractor);
    }


    private async makeUserAvatar(avatar) {
        const photo = new Photo();

        photo.location = await this.fileService.createFile(FileType.IMAGE, avatar);

        return photo;
    }

}