import { Service } from 'src/entities/service.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Contractor } from 'src/entities/contractor.entity';
import { User } from 'src/entities/user.entity';
import { AssignmentStatus } from '../../Infrastructure/Models/assignment.entity';
import { Doc } from 'src/entities/doc.entity';

export class AssignmentDto {
    
    client: User;

    contractor: Contractor;

    service: Service

    @IsString()
    location_latitude: string;

    @IsString()
    location_longitude: string;

    @IsString()
    contractor_location_latitude: string;

    @IsString()
    contractor_location_longitude: string;

    @IsNumber()
    payment_amount: number;

    @IsString()
    description: string;

    status: AssignmentStatus;

    docs?: Doc[];
}