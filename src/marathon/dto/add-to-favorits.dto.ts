import { IsNumber } from "class-validator";

export class AddToFavoritsDto {
    @IsNumber()
    user: number;
}