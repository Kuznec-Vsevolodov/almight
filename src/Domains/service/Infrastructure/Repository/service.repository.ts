import { Injectable } from "@nestjs/common/decorators";
import { CategoryService } from "src/Domains/category/Business/category.service";
import { TagService } from "src/Domains/tag/Business/tag.service";
import { CreateTagDto } from "src/Domains/tag/Presentation/Dto/create-tag.dto";
import { ServiceDto } from "../../Business/Dto/service.dto";
import { Service } from "../Models/service.entity";
import { ServiceCategory } from "../Models/service_category.entity";
import { ServiceTag } from "../Models/Service_tag.entity";

@Injectable()
export class ServiceRepository{
    constructor(
        private categoryService: CategoryService,
        private tagServise: TagService
    ){}

    private service = Service.getRepository();

    async create(creationDto: ServiceDto) {
        return Service.create({...creationDto}).save();
    }

    async getServiceById(id){
        return this.service.createQueryBuilder("services")
            .leftJoinAndSelect('services.author', 'users')
            .leftJoinAndSelect('services.preview_photo', 'photos')
            .leftJoinAndSelect('services.categories', 'categories')
            .leftJoinAndSelect('services.tags', 'tags')
            .select(['photos.location', 'services', 'tags', 'categories'])
            .where('services.id = :id', { id })
            .getOne();
    }

    async getContractorByServiceId(id){
        return this.service.createQueryBuilder("services")
            .leftJoinAndSelect('services.contractors', 'contractors')
            .leftJoinAndSelect('contractors.avatar', 'photos')
            .select(['contractors', 'photos.location', 'services'])
            .where('services.id = :id', { id })
            .getMany();
    }

    async getServices(){
        return this.service.createQueryBuilder("services")
            .leftJoinAndSelect('services.author', 'users')
            .leftJoinAndSelect('services.preview_photo', 'photos')
            .leftJoinAndSelect('services.categories', 'categories')
            .leftJoinAndSelect('services.tags', 'tags')
            .select(['photos.location', 'services', 'tags', 'categories'])
            .getMany();
    }

    async createCategory(categoryData, service){
        const category = new ServiceCategory();

        category.service = service;
        category.category = await this.categoryService.getById(categoryData.category);

        return category.save();
    }

    async createTag(tagData, service){
        const tag = new ServiceTag();

        let tagDto = new CreateTagDto();
        tagDto.name = tagData;

        tag.service = service;
        tag.tag = await this.tagServise.create(tagDto);

        return tag.save();
    }
}