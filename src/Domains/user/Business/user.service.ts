import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../Presentation/Dto/create-user.dto';
import { UserReader } from './Reader/user.reader';
import { UserWriter } from './Writer/user.writer';

@Injectable()
export class UserService {

    constructor(
        private userWriter: UserWriter,
        private userReader: UserReader,
    ) { }

    async create(dto: CreateUserDto){
        return await this.userWriter.create(dto);
    }

    async getById(id){
        return await this.userReader.getById(id);
    }
}
