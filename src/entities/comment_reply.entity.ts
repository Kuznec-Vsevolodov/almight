import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { PostComment } from './comment.entity';
import { CommentReplyLike } from './comment_reply_like.entity';
import { User } from './user.entity';

@Entity({ name: 'posts_comments_replies', schema: 'public' })
export class PostCommentReply extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => PostComment, (comment) => comment.replies)
    @JoinColumn({ name: 'comment' })
    comment: PostComment;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.comments_replies)
    @JoinColumn({ name: 'user' })
    user: User;

    @IsString()
    @Column({ type: 'text', nullable: false })
    text: string;

    @OneToMany(() => CommentReplyLike, (like) => like.comment_reply)
    likes: CommentReplyLike[];

}