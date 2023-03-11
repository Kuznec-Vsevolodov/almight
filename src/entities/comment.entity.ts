import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { PostCommentReply } from './comment_reply.entity';
import { CommentLike } from './comment_like.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'posts_comments', schema: 'public' })
export class PostComment extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post' })
    post: Post;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user' })
    user: User;

    @IsString()
    @Column({ type: 'text', nullable: false })
    text: string;

    @OneToMany(() => PostCommentReply, (replies) => replies.comment)
    replies: PostCommentReply[];

    @OneToMany(() => CommentLike, (like) => like.comment)
    likes: CommentLike[];
}