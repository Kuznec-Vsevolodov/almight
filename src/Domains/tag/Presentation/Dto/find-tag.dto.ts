import { IsString } from 'class-validator';

export class FindTagDto {
    @IsString()
    name: string;
}