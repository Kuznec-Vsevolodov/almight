import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {

    @IsString()
    full_name: string;

    @IsNumber()
    role: number;

    @IsString()
    password: string;

    @IsEmail()
    email: string;

}