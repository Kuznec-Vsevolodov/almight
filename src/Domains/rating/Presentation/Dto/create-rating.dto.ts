import { IsNumber, IsString } from 'class-validator';

export class CreateRatingDto {
    @IsNumber()
    client: number;

    @IsNumber()
    contractor: number;

    @IsNumber()
    value: number;


    @IsString()
    comment: string;
}