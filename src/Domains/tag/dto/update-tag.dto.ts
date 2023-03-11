import { IsString } from 'class-validator';

export class UpdateTagDto {
    @IsString()
    name: string;

    @IsString()
    type: string;
}