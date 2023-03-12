import { IsNumber, IsString } from "class-validator";
import { Contractor } from "src/Domains/contractor/Infrastructure/Models/contractor.entity";
import { Photo } from "src/Domains/photo/Infrastructure/Models/photo.entity";
import { User } from "src/Domains/user/Infrastructure/Models/user.entity";
import { ServiceCategory } from "../../Infrastructure/Models/service_category.entity";
import { ServiceTag } from "../../Infrastructure/Models/service_tag.entity";

export class ServiceDto {
    author: User;

    @IsString()
    name: string;

    @IsString()
    price_position_name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    average_rating: number;

    preview_photo: Photo;

    categories?: ServiceCategory[];

    contractors?: Contractor[];

    tags?: ServiceTag[];

    @IsString()
    description: string;

}