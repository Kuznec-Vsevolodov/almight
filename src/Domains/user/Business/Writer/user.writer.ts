import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../Presentation/Dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { UserDto } from '../Dto/user.dto';
import { UserRepository } from '../../Infrastructure/Repository/user.repository';
import { UserRole } from '../../Infrastructure/Models/user.entity';

@Injectable()
export class UserWriter {

    constructor(
        private userRepository: UserRepository
    )
    {}

    async create(dto: CreateUserDto){
        const salt = await genSalt(10);
        const user = new UserDto();

        user.full_name = dto.full_name;
        user.role = UserRole[dto.role];
        user.password = await hash(dto.password, salt);
        user.email = dto.email;

        return await this.userRepository.create(user);
    }

}
