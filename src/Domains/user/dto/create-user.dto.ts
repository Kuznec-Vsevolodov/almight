import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Photo } from '../../entities/photo.entity';

export class CreateUserDto {

    @IsString()
    full_name: string;

    @IsString()
    short_name: string;

    @IsString()
    date_of_birth: string;

    @IsString()
    last_online: string;

    @IsString()
    gender: string;

    @IsString()
    role: string;

    @IsNumber()
    prime_subscrption_price: number;

    @IsString()
    password: string;

    @IsEmail()
    email: string;

}