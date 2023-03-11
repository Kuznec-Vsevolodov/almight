import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../Shared/Entity/baseEntity';

@Entity({ name: 'docs', schema: 'public' })
export class Doc extends GeneralEntity {
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