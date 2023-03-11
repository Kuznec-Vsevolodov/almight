import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Post } from './post.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity({ name: 'posts_dislikes', schema: 'public' })
export class PostDislike extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Post, (post) => post.dislikes)
    @JoinColumn({ name: 'post' })
    post: Post;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.dislikes)
    @JoinColumn({ name: 'user' })
    user: User;
}