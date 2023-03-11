import { IsNumber, IsString } from 'class-validator';

export class CreateMarathonDto {
    @IsString()
    name: string;

    @IsString()
    start_date: string;

    @IsString()
    end_date: string;

    @IsNumber()
    price: number;

    @IsString()
    description: string;
}