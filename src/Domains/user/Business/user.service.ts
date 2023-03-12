import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../Presentation/Dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        private userService: UserService,
    ) { }

    async create(dto: CreateUserDto){
        return await this.userService.create(dto);
    }

    async getById(id){
        return await this.userService.getById(id);
    }
}
