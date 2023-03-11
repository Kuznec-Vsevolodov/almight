import { IsNumber } from 'class-validator';

export class UpdateStatusDto {
    @IsNumber()
    status: number;
}