import { Service } from 'src/Domains/service/Infrastructure/Models/service.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Contractor } from 'src/Domains/contractor/Infrastructure/Models/contractor.entity';
import { User } from 'src/Domains/user/Infrastructure/Models/user.entity';
import { AssignmentStatus } from '../../Infrastructure/Models/assignment.entity';
import { Doc } from 'src/Domains/assignment/Infrastructure/Models/doc.entity';

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