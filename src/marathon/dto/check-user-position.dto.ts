import { IsNumber } from "class-validator";

export class CheckUserPositionDto {

    @IsNumber()
    user: number;
}