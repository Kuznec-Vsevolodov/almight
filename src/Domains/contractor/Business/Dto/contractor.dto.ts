import { Service } from 'src/Domains/service/Infrastructure/Models/service.entity';
import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';
import { Photo } from 'src/Domains/photo/Infrastructure/Models/photo.entity';

export class ContractorDto {
    
    user: User;

    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    email: string;

    @IsString()
    phone_number: string;

    @IsNumber()
    average_rating: number;

    avatar: Photo;

    service: Service;
}