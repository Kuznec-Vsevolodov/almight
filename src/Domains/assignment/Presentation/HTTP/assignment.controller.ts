import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AssignmentService } from '../../Business/assignment.service';
import { CreateAssignmentDto } from '../dto/create-assignment.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('assignments')
export class AssignmentController {
    constructor(private readonly assignmentService: AssignmentService) { }

    @Post('/')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'docs', maxCount: 10 },
    ]))
    async create(@Body() dto: CreateAssignmentDto, @UploadedFiles() files) {
        const { docs } = files;
        return this.assignmentService.create(dto, docs);
    }

    @Get('/:id')
    async getById(@Param('id') id: number) {
        return this.assignmentService.getById(id);
    }

    @Get('/client/:id')
    async getByClientId(@Param('id') id: number) {
        return this.assignmentService.getByClientId(id);
    }

    @Patch(':id/update-status/')
    async update(@Body() dto: UpdateStatusDto, @Param('id') id: number) {
        return this.assignmentService.updateStatus(dto, id)
    }

}
