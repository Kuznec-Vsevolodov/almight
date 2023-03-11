import { Injectable } from '@nestjs/common';
import { Photo } from '../entities/photo.entity';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class PhotoService {
    constructor(
        private fileService: FileService,
    ) { }

    public async uploadPhotoForManyToMany(photo_file) {
        const photo = new Photo();

        photo.location = await this.fileService.createFile(FileType.IMAGE, photo_file);

        return photo.save();
    }

    public async uploadPhotoForPreviewOrAvatar(photo_file) {
        const photo = new Photo();

        photo.location = await this.fileService.createFile(FileType.IMAGE, photo_file);

        return photo;
    }

}
