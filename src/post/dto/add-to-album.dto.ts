import { IsNumber } from 'class-validator';

export class AddToAlbumDto {
    @IsNumber()
    album: number;
}