import { IsNumber, IsString } from "class-validator";
import { Contractor } from "src/Domains/contractor/Infrastructure/Models/contractor.entity";
import { User } from "src/Domains/user/Infrastructure/Models/user.entity";

export class RatingDto {
    client: User;

    contractor: Contractor;

    @IsNumber()
    value: number;

    @IsString()
    comment: string;
}