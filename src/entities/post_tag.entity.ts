import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'posts_tags', schema: 'public' })
export class PostTag extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.posts)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @ManyToOne(() => Post, (post) => post.tags)
    @JoinColumn({ name: 'post' })
    post: Post;

}