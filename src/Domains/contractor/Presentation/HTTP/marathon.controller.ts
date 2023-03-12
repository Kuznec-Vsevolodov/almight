import { Controller, UseInterceptors, Post, Body, UploadedFiles, Get, Param } from '@nestjs/common';
import { CreateContractorDto } from '../dto/create-contractor.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ContractorService } from '../../Business/contractor.service';

@Controller('contractors')
export class ContractorController {

    constructor(private readonly contractorService: ContractorService) { }

    @Post('/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
    ]))
    async create(@Body() dto: CreateContractorDto, @UploadedFiles() files) {
        const { avatar } = files;
        return this.contractorService.create(dto, avatar[0]);
    }

    @Get(':id/')
    async checkUserPosition(@Param('id') id: number) {
        return this.contractorService.getById(id)
    }
}
