import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity({ name: 'courses_reviews', schema: 'public' })
export class CourseReview extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.course_reviews)
    @JoinColumn({ name: "user" })
    user: User;

    @IsString()
    @Column({ type: 'text', nullable: false })
    text: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    score: number;

    @ManyToOne(() => Course, (course) => course.reviews)
    @JoinColumn({ name: "course" })
    course: Course;
}
