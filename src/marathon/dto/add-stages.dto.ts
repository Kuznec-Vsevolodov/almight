import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsString, ValidateNested } from 'class-validator'

class StageDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDateString()
    start_date: string;

    @IsDateString()
    end_date: string;
}

export class AddStagesDto {
    @IsArray()
    @ValidateNested()
    @Type(() => StageDto)
    stages: StageDto[];
}