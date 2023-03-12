import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../Infrastructure/Repository/service.repository';

@Injectable()
export class ServiceReader {

    constructor(
        private serviceRepository: ServiceRepository
    ) { }

    async getById(id) {
        return await this.serviceRepository.getServiceById(id);
    }

    async getContractorsByServiceId(service_id) {
        return await this.serviceRepository.getContractorByServiceId(service_id);
    }

    async getServices(){
        return await this.serviceRepository.getServices();
    }

}