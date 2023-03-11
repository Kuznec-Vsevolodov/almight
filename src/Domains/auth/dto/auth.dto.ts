import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
    @IsString()
    password: string;

    @IsEmail()
    email: string;
}