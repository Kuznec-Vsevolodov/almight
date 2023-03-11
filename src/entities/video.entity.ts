import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';

@Entity({ name: 'videos', schema: 'public' })
export class Video extends GeneralEntity {
    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @IsNumber()
    @Column({ type: 'float', nullable: true })
    duration: number;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    type: string;
}
