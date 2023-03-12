import { IsNumber, IsString } from "class-validator";
import { Category } from "src/Domains/category/Infrastructure/Models/category.entity";
import { Contractor } from "src/Domains/contractor/Infrastructure/Models/contractor.entity";
import { Photo } from "src/Domains/photo/Infrastructure/Models/photo.entity";
import { Service } from "../../Infrastructure/Models/service.entity";
import { ServiceCategory } from "../../Infrastructure/Models/service_category.entity";
import { ServiceTag } from "../../Infrastructure/Models/service_tag.entity";

export class ServiceCatagoryDto {
    category: Category;

    service: Service;
}