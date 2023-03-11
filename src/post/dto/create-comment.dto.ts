import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNumber()
    author: number

    @IsString()
    text: string
}