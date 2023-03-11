import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { CategoryTag } from './category_tag.entity';
import { CourseTag } from './course_tag.entity';
import { MarathonTag } from './marathon_tag.entity';
import { PostTag } from './post_tag.entity';
import { UserTag } from './user_tag.entity';

@Entity({ name: 'tags', schema: 'public' })
export class Tag extends GeneralEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    type: string;

    @OneToMany(() => CategoryTag, (category) => category.tag)
    categories: CategoryTag[];

    @OneToMany(() => MarathonTag, (marathon) => marathon.tag)
    marathons: MarathonTag[];

    @OneToMany(() => CourseTag, (course) => course.tag)
    courses: CourseTag[];

    @OneToMany(() => PostTag, (post) => post.tag)
    posts: PostTag[];

    @OneToMany(() => UserTag, (user) => user.tag)
    users: UserTag[];

}
