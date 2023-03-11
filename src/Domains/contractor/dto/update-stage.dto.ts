import { IsDateString, IsString } from 'class-validator';

export class UpdateStageDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;
}