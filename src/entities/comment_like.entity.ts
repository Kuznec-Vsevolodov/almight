import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { PostComment } from './comment.entity';
import { User } from './user.entity';

@Entity({ name: 'comments_likes', schema: 'public' })
export class CommentLike extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => PostComment, (comment) => comment.likes)
    @JoinColumn({ name: 'comment' })
    comment: PostComment;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.comments_likes)
    @JoinColumn({ name: 'user' })
    user: User;
}