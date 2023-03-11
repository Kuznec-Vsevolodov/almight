import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { Post } from './post.entity';

@Entity({ name: 'courses_lessons', schema: 'public' })
export class CourseLesson extends GeneralEntity {
    @ManyToOne(() => Post, (post) => post.courses)
    @JoinColumn({ name: "lesson" })
    lesson: Post;

    @ManyToOne(() => Course, (course) => course.lessons)
    @JoinColumn({ name: "course" })
    course: Course;
}
