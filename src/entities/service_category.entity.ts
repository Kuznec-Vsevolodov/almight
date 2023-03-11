import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Category } from './category.entity';
import { Service } from './service.entity';

@Entity({ name: 'courses_categories', schema: 'public' })
export class ServiceCategory extends BaseEntity {
    @IsNumber()
    @ManyToOne(() => Service, (service) => service.categories)
    @JoinColumn({ name: 'service' })
    service: Service;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.services)
    @JoinColumn({ name: 'category' })
    category: Category;
}