import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { CategoryTag } from './category_tag.entity';
import { CourseCategory } from './course_category.entity';
import { MarathonCategory } from './marathon_category.entity';
import { PostCategory } from './post_category.entity';
import { Tag } from './tag.entity';
import { UserCategory } from './user_category.entity';

@Entity({ name: 'categories', schema: 'public' })
export class Category extends GeneralEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @IsBoolean()
    @Column({ name: "is_parent", default: false })
    isParent: boolean;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.children)
    @JoinColumn({ name: 'parent' })
    parent?: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children?: Category[];

    //@ManyToMany(() => Tag)
    //@JoinTable()
    //tags: Tag[];

    @OneToMany(() => UserCategory, (user) => user.category)
    users?: UserCategory[];

    @OneToMany(() => MarathonCategory, (marathon) => marathon.category)
    marathons?: MarathonCategory[];

    @OneToMany(() => CourseCategory, (course) => course.category)
    courses?: CourseCategory[];

    @OneToMany(() => PostCategory, (post) => post.category)
    posts?: PostCategory[];

    @OneToMany(() => CategoryTag, (tag) => tag.category)
    tags?: CategoryTag[];
}
