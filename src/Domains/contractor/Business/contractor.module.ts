import { Module } from '@nestjs/common';
import { FileService } from '../../file/Busines/file.service';
import { PhotoService } from '../../photo/Busines/photo.service';
import { ContractorController } from '../Presentation/HTTP/marathon.controller';
import { ContractorService } from './contractor.service';

@Module({
  controllers: [ContractorController],
  providers: [ContractorService, FileService, PhotoService]
})
export class ContractorModule { }
