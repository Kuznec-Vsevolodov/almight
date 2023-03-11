import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';

@Entity({ name: 'docs', schema: 'public' })
export class Doc extends BaseEntity {
    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    type: string;
}