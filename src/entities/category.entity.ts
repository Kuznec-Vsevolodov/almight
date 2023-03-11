import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { ServiceCategory } from './service_category.entity';

@Entity({ name: 'categories', schema: 'public' })
export class Category extends BaseEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;
    
    @OneToMany(() => ServiceCategory, (service) => service.category)
    services?: ServiceCategory[];
}
