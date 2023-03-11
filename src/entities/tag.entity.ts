import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { ServiceTag } from './service_tag.entity';

@Entity({ name: 'tags', schema: 'public' })
export class Tag extends BaseEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @OneToMany(() => ServiceTag, (service) => service.tag)
    services: ServiceTag[];
}
