import { Injectable } from '@nestjs/common';
import { FileService, FileType } from 'src/Domains/file/Busines/file.service';
import { Service } from 'src/Domains/service/Infrastructure/Models/service.entity';
import { User } from 'src/Domains/user/Infrastructure/Models/user.entity';
import { ContractorDto } from '../Dto/contractor.dto';
import { CreateContractorDto } from '../../Presentation/dto/create-contractor.dto';
import { ContractorRepository } from '../../Infrastructure/Repository/contractor.repository';
import { Photo } from 'src/Domains/photo/Infrastructure/Models/photo.entity';
import { UserService } from 'src/Domains/user/Business/user.service';

@Injectable()
export class ContractorWriter {

    constructor(
        private fileService: FileService,
        private contractorRepository: ContractorRepository,
        private userService: UserService,
    ) { }

    public async create(presentationDto: CreateContractorDto, avatar) {
        const contractor = new ContractorDto();

        contractor.user = await this.userService.getById(presentationDto.user);
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