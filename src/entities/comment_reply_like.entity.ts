import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { PostComment } from './comment.entity';
import { PostCommentReply } from './comment_reply.entity';
import { User } from './user.entity';

@Entity({ name: 'comments_replies_likes', schema: 'public' })
export class CommentReplyLike extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => PostCommentReply, (comment) => comment.likes)
    @JoinColumn({ name: 'comment_reply' })
    comment_reply: PostCommentReply;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.comments_replies_likes)
    @JoinColumn({ name: 'user' })
    user: User;
}