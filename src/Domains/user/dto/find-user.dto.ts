import { IsString } from 'class-validator';

export class FindUserDto {
    @IsString()
    name: string;
}