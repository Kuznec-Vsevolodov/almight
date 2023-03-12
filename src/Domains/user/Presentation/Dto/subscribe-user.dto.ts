import { IsNumber } from 'class-validator';

export class SubscribeUserDto {

    @IsNumber()
    author_id: number;
}