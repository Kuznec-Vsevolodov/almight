import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsBoolean()
    is_course: boolean;

    @IsBoolean()
    is_premium: boolean;
}