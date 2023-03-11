import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Category } from './category.entity';
import { Post } from './post.entity';

@Entity({ name: 'posts_categories', schema: 'public' })
export class PostCategory extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Post, (post) => post.categories)
    @JoinColumn({ name: 'post' })
    post: Post;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.posts)
    @JoinColumn({ name: 'category' })
    category: Category;
}