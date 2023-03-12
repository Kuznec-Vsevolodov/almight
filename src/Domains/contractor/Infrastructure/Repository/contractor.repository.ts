import { Injectable } from "@nestjs/common/decorators";
import { ContractorDto } from "../../Business/Dto/contractor.dto";
import { Contractor } from "../Models/contractor.entity";

@Injectable()
export class ContractorRepository{

    private contractor = Contractor.getRepository();

    async create(creationDto: ContractorDto) {
        return Contractor.create({...creationDto}).save();
    }

    async getContractorById(id){
        return this.contractor.createQueryBuilder("contractors")
            .leftJoinAndSelect('contractors.service', 'services')
            .leftJoinAndSelect('contractors.avatar', 'photos')
            .select(['contractors', 'photos.location', 'services'])
            .where('contractors.id = :id', { id })
            .getOne();
    }

    // async getContractorByServiceId(id){
    //     return this.contractor.createQueryBuilder("contractors")
    //         .leftJoinAndSelect('contractors.service', 'services')
    //         .leftJoinAndSelect('contractors.avatar', 'photos')
    //         .select(['contractors', 'photos.location', 'services'])
    //         .where('services.id = :id', { id })
    //         .getMany();
    // }

}