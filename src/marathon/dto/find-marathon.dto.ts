import { IsString } from 'class-validator';

export class FindMarathonDto {
    @IsString()
    name: string;
}