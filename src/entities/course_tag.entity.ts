import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'courses_tags', schema: 'public' })
export class CourseTag extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.courses)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @ManyToOne(() => Course, (course) => course.tags)
    @JoinColumn({ name: 'course' })
    course: Course;

}