import { Injectable } from '@nestjs/common';
import { FileService, FileType } from 'src/Domains/file/Busines/file.service';
import { User } from 'src/entities/user.entity';
import { ServiceDto } from '../Dto/service.dto';
import { CategoryDto, CreateServiceDto, TagDto } from '../../Presentation/Dto/create-course.dto';
import { ServiceRepository } from '../../Infrastructure/Repository/service.repository';
import { Photo } from 'src/Domains/photo/Infrastructure/Models/photo.entity';
import { ServiceCategory } from '../../Infrastructure/Models/service_category.entity';
import { ServiceReader } from '../Reader/service.reader';
import { ServiceTag } from '../../Infrastructure/Models/Service_tag.entity';

@Injectable()
export class ServiceWriter {

    constructor(
        private fileService: FileService,
        private serviceRepository: ServiceRepository,
        private serviceReader: ServiceReader
    ) { }

    public async create(presentationDto: CreateServiceDto, preview_photo) {
        const service = new ServiceDto();

        service.author = await User.findOne({ where: { id: presentationDto.author} });
        service.name = presentationDto.name;
        service.description = presentationDto.description;
        service.price = presentationDto.price;
        service.price_position_name = presentationDto.price_position_name;
        service.average_rating = 0;
        service.preview_photo = await this.makeServicePreviewPhoto(preview_photo);

        return await this.serviceRepository.create(service);
    }


    private async makeServicePreviewPhoto(preview_photo) {
        const photo = new Photo();

        photo.location = await this.fileService.createFile(FileType.IMAGE, preview_photo);

        return photo;
    }

    async addCategories(dto: CategoryDto[], id) {
        const categories: ServiceCategory[] = [];

        const service = this.serviceReader.getById(id);

        for (const category of dto) {
            const savedCategory = await this.createCategory(category.category, service)
            categories.push(savedCategory);
        }

        return categories;
    }

    async createCategory(categoryData, service) {
        return this.serviceRepository.createCategory(categoryData, service)
    }

    async addTags(dto: TagDto[], id) {
        const tags: ServiceTag[] = [];

        const service = this.serviceReader.getById(id);

        for (const tag of dto) {
            const savedTag = await this.createTag(tag.tag, service)
            tags.push(savedTag);
        }

        return tags;
    }

    async createTag(tagData, service) {
        return this.serviceRepository.createTag(tagData, service)
    }

}