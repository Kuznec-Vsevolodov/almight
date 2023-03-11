import { IsString } from 'class-validator';

export class FindByNameDto {
    @IsString()
    name: string;
}