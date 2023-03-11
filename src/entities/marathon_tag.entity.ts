import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Marathon } from './marathon.entity';
import { Course } from './course.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'marathons_tags', schema: 'public' })
export class MarathonTag extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.marathons)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @ManyToOne(() => Marathon, (marathon) => marathon.tags)
    @JoinColumn({ name: 'marathon' })
    marathon: Marathon;
}