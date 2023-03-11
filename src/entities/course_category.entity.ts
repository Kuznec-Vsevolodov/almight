import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Category } from './category.entity';
import { Course } from './course.entity';

@Entity({ name: 'courses_categories', schema: 'public' })
export class CourseCategory extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Course, (course) => course.categories)
    @JoinColumn({ name: 'course' })
    course: Course;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.courses)
    @JoinColumn({ name: 'category' })
    category: Category;
}