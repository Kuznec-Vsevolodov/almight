import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../Infrastructure/Models/user.entity';

export class UserDto {
    @IsString()
    full_name: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsEmail()
    email: string;
    
    role: UserRole;
}
