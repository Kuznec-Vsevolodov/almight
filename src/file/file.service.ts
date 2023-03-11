import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image',
    DOCUMENT = 'document'
}

@Injectable()
export class FileService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    async createFile(type: FileType, file): Promise<string> {
        try {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuid.v4() + '.' + fileExtension

            const fileKey = type + '/' + fileName;

            let fullPath: string;
            await this.uploadToS3(file.buffer, fileKey).then(() => {
                fullPath = "https://d3kdj4aqjpwh2c.cloudfront.net/" + fileKey
            })

            return fullPath;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadToS3(dataBuffer: Buffer, fileName: string) {
        const s3 = new S3();

        const uploadResult = await s3.upload({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Body: dataBuffer,
            Key: fileName,

        }).promise();

        return uploadResult;
    }
}
