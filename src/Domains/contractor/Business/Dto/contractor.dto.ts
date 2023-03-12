import { Service } from 'src/entities/service.entity';
import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';
import { Photo } from 'src/entities/photo.entity';

export class ContractorDto {
    
    user: User;

    @IsString()
    name: string;

    @IsString()
    assress: string;

    @IsString()
    email: string;

    @IsString()
    phone_number: string;

    @IsNumber()
    average_rating: number;

    avatar: Photo;

    service: Service;
}