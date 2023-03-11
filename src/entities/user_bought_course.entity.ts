import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity({ name: 'users_bought_courses', schema: 'public' })
export class UserBoughtCourse extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.bought_courses)
    @JoinColumn({ name: "student" })
    student: User;

    @ManyToOne(() => Course, (course) => course.students)
    @JoinColumn({ name: "course" })
    course: Course;
}
