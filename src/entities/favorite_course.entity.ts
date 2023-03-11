import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { User } from './user.entity';

@Entity({ name: 'users_favorite_courses', schema: 'public' })
export class UserFavoriteCourse extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.favorite_courses)
    @JoinColumn({ name: "user" })
    user: User;

    @ManyToOne(() => Course, (course) => course.favorits)
    @JoinColumn({ name: "course" })
    course: Course;
}
