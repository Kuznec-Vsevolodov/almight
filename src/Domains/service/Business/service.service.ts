import { Injectable } from '@nestjs/common';
import { CategoryDto, TagDto } from '../Presentation/Dto/create-service.dto';
import { ServiceWriter } from './Writer/service.writer';
import { ServiceReader } from './Reader/service.reader';
import { CreateServiceDto } from '../Presentation/Dto/create-service.dto';

@Injectable()
export class ServiceService {

    constructor(
        private serviceWriter: ServiceWriter,
        private serviceReader: ServiceReader,
    ) { }

    async create(createServiceDto: CreateServiceDto, preview_photo){
        return await this.serviceWriter.create(createServiceDto, preview_photo);
    }

    async addCategories(dto: CategoryDto[], id){
        return await this.serviceWriter.addCategories(dto, id);
    }

    async addTags(dto: TagDto[], id){
        return await this.serviceWriter.addTags(dto, id);
    }

    async getById(id){
        return await this.serviceReader.getById(id);
    }

    async getContractorsByServiceId(id){
        return await this.serviceReader.getContractorsByServiceId(id);
    }

    async getServices(){
        return await this.serviceReader.getServices();
    }
}
