import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Post } from './post.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity({ name: 'posts_likes', schema: 'public' })
export class PostLike extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Post, (post) => post.likes)
    @JoinColumn({ name: 'post' })
    post: Post;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.likes)
    @JoinColumn({ name: 'user' })
    user: User;
}