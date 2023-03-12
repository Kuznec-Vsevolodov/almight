import { Body, Controller, Get, Param, Post} from '@nestjs/common';

import { CreateUserDto } from '../Dto/create-user.dto';
import { UserService } from '../../Business/user.service';

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Post('/')
    async create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto );
    }

    @Get(':/id')
    async getOne(@Param('id') id: number) {
        return this.userService.getById(id);
    }
}
