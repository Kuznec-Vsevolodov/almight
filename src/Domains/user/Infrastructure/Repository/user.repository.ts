import { Injectable } from "@nestjs/common/decorators";
import { UserDto } from "../../Business/Dto/user.dto";
import { User } from "../Models/user.entity";

@Injectable()
export class UserRepository{

    private user = User.getRepository();

    async create(creationDto: UserDto) {
        return User.create({...creationDto}).save();
    }

    async getUserById(id){
        return this.user.createQueryBuilder("users")
            .where('users.id = :id', { id })
            .getOne();
    }

}