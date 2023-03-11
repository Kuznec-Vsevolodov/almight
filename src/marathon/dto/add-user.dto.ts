import { IsNumber } from "class-validator";

export class AddUserDto {
    @IsNumber()
    user: number;
}