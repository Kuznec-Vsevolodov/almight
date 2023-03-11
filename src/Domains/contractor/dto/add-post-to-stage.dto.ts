import { IsNumber } from "class-validator";

export class AddPostToStageDto {
    @IsNumber()
    post: number;
}