import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Photo } from '../../../photo/Infrastructure/Models/photo.entity';
import { Assignment } from 'src/Domains/assignment/Infrastructure/Models/assignment.entity';
import { ServiceCategory } from './service_category.entity';
import { ServiceTag } from './Service_tag.entity';
import { Contractor } from '../../../contractor/Infrastructure/Models/contractor.entity';
import { User } from '../../../../entities/user.entity';

@Entity({ name: 'services', schema: 'public' })
export class Service extends BaseEntity {
    @ManyToOne(() => User, (user) => user.services)
    @JoinColumn({ name: "author" })
    author: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    price: number;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false})
    price_position_name: string;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @IsNumber()
    @Column({ type: "float", nullable: true, default: 0 })
    average_rating: number;

    @JoinColumn({ name: "preview_photo" })
    preview_photo: Photo;

    @OneToMany(() => ServiceCategory, (category) => category.service)
    categories?: ServiceCategory[];

    @OneToMany(() => Contractor, (contractor) => contractor.service)
    contractors?: Contractor[];

    @OneToMany(() => ServiceTag, (tag) => tag.service)
    tags?: ServiceTag[];

    @OneToMany(() => Assignment, (assignment) => assignment.service)
    assignments?: Assignment[];

}