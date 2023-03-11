import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';


@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) { }

    async validateUser(dto: AuthDto): Promise<any> {
        const user = await User.findOne({ where: { email: dto.email } });

        if (user && (await compare(dto.password, user.password))) {
            const { password, ...result } = user;
            console.log(result);
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, id: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
