import { IsNumber } from "class-validator";

export class RateUserDto {
    @IsNumber()
    candidate: number;

    @IsNumber()
    score: number;
}