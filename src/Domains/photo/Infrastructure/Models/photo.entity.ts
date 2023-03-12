import { IsString } from 'class-validator';
import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Service } from '../../../service/Infrastructure/Models/service.entity';
import { Contractor } from '../../../contractor/Infrastructure/Models/contractor.entity';

@Entity({ name: 'photos', schema: 'public' })
export class Photo extends BaseEntity {
    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @OneToOne(() => Contractor, (contractor) => contractor.avatar)
    contractor: Contractor

    @OneToOne(() => Service, (service) => service.preview_photo)
    service: Service
}
