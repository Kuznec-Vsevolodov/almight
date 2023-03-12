import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../Infrastructure/Repository/user.repository'; 

@Injectable()
export class userReader {

    constructor(
        private userRepository: UserRepository
    ) { }

    async getById(id) {
        return await this.userRepository.getUserById(id);
    }

}