import { IsString } from 'class-validator';

export class FindByTagTypeDto {
    @IsString()
    type: string;
}