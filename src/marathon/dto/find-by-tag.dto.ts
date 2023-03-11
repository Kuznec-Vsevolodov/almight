import { IsString } from 'class-validator';

export class FindByTagDto {
    @IsString()
    name: string;
}