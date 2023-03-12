import { IsNumber, IsString } from 'class-validator';

export class CreateContractorDto {
    @IsNumber()
    user: number;

    @IsNumber()
    service: number;

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
}