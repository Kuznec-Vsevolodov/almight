import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Service } from './service.entity';
import { Tag } from 'src/Domains/tag/Infrastructure/Models/tag.entity';

@Entity({ name: 'Services_tags', schema: 'public' })
export class ServiceTag extends BaseEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.services)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @ManyToOne(() => Service, (service) => service.tags)
    @JoinColumn({ name: 'service' })
    service: Service;
}