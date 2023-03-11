import { IsNumber } from 'class-validator';

export class CheckLikeDto {
    @IsNumber()
    user: number;
}