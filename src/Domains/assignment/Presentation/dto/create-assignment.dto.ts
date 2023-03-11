import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAssignmentDto {
    @IsString()
    description: string;

    @IsNumber()
    client: number;

    @IsNumber()
    contractor: number;

    @IsNumber()
    service: number;

    @IsString()
    location_latitude: string;

    @IsString()
    location_longitude: string;

    @IsString()
    contractor_location_latitude: string;

    @IsString()
    contractor_location_longitude: string;

    @IsNumber()
    payment_amount: number;
}