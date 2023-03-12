import { Injectable } from '@nestjs/common';
import { CreateContractorDto, } from '../Presentation/dto/create-contractor.dto';
import { ContractorReader } from './Reader/contractor.reader';
import { ContractorWriter } from './Writer/contractor.writer';

@Injectable()
export class ContractorService {

    constructor(
        private contractorWriter: ContractorWriter,
        private contractorReader: ContractorReader,
    ) { }

    async create(presentationDto: CreateContractorDto, avatar){
        return await this.contractorWriter.create(presentationDto, avatar);
    } 

    async getById(id){
        return await this.contractorReader.getById(id);
    }

    // async getByServiceId(user_id){
    //     return await this.contractorReader.getByServiceId(user_id);
    // }
}
