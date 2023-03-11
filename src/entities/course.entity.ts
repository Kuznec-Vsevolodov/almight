import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { CourseReview } from './course_review.entity';
import { Photo } from './photo.entity';
import { Post } from './post.entity';
import { Tag } from './tag.entity';
import { UserBoughtCourse } from './user_bought_course.entity';
import { User } from './user.entity';
import { CourseLesson } from './course_lessons.entity';
import { UserFavoriteCourse } from './favorite_course.entity';
import { CourseCategory } from './course_category.entity';
import { CourseTag } from './course_tag.entity';

@Entity({ name: 'courses', schema: 'public' })
export class Course extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.courses)
    @JoinColumn({ name: "author" })
    author: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    price: number;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @IsNumber()
    @Column({ type: "float", nullable: true, default: 0 })
    average_rating: number;

    @OneToOne(() => Photo, (photo) => photo.course, {
        cascade: true
    })
    @JoinColumn({ name: "preview_photo" })
    preview_photo: Photo;

    @OneToMany(() => CourseReview, (review) => review.course)
    reviews: CourseReview[];

    @OneToMany(() => UserBoughtCourse, (students) => students.course)
    students: UserBoughtCourse[];

    @OneToMany(() => CourseLesson, (lessons) => lessons.course)
    lessons: CourseLesson[];

    @OneToMany(() => UserFavoriteCourse, (users) => users.course, {
        cascade: true
    })
    favorits: UserFavoriteCourse[];

    @OneToMany(() => CourseCategory, (category) => category.course)
    categories: CourseCategory[];

    @OneToMany(() => CourseTag, (tag) => tag.course)
    tags: CourseTag[];

}