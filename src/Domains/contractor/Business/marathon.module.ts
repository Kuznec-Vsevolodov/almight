import { Module } from '@nestjs/common';
import { FileService } from '../../file/file.service';
import { PhotoService } from '../../photo/photo.service';
import { TagService } from '../../tag/tag.service';
import { ContractorController } from '../Presentation/HTTP/marathon.controller';
import { ContractorService } from './contractor.service';

@Module({
  controllers: [ContractorController],
  providers: [ContractorService, FileService, PhotoService]
})
export class ContractorModule { }
