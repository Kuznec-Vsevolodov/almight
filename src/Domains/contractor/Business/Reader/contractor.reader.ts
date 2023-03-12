import { Injectable } from '@nestjs/common';
import { ContractorRepository } from '../../Infrastructure/Repository/contractor.repository';

@Injectable()
export class ContractorReader {

    constructor(
        private contractorRepository: ContractorRepository
    ) { }

    async getById(id) {
        return await this.contractorRepository.getContractorById(id);
    }

    // async getByServiceId(service_id) {
    //     return await this.contractorRepository.getContractorByServiceId(service_id);
    // }

}