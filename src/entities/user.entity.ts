import { IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Album } from './album.entity';
import { ApplicationSubscription } from './application_subscription.entity';
import { Category } from './category.entity';
import { PostComment } from './comment.entity';
import { PostCommentReply } from './comment_reply.entity';
import { CommentLike } from './comment_like.entity';
import { Course } from './course.entity';
import { CourseReview } from './course_review.entity';
import { UserFavoriteCourse } from './favorite_course.entity';
import { UserFavoriteMarathon } from './favorite_marathon.entity';
import { Marathon } from './marathon.entity';
import { UserSubscribedMarathon } from './marathon_subscription.entity';
import { Photo } from './photo.entity';
import { Post } from './post.entity';
import { PostDislike } from './post_dislike.entity';
import { PostLike } from './post_like.entity';
import { StageVote } from './stage_vote.entity';
import { UserBoughtCourse } from './user_bought_course.entity';
import { UserCategory } from './user_category.entity';
import { UserMarathon } from './user_marathon.entity';
import { UserTag } from './user_tag.entity';
import { CommentReplyLike } from './comment_reply_like.entity';

@Entity({ name: 'users', schema: 'public' })
export class User extends GeneralEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    full_name: string;

    @IsString()
    @Column({ type: 'varchar', length: 250, nullable: true })
    @MinLength(8)
    password: string;

    @IsEmail()
    @Column({ type: 'varchar', length: 250, nullable: true, unique: true })
    email: string;

    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    short_name: string;

    @IsString()
    @Column({ type: 'date', nullable: false })
    date_of_birth: string;

    @OneToOne(() => Photo, (photo) => photo.user, {
        cascade: true
    })
    @JoinColumn({ name: 'avatar_id' })
    avatar?: Photo;

    @IsString()
    @Column({ type: 'timestamp', nullable: true })
    last_online: string;

    @IsString()
    @Column({ type: 'varchar', length: 20, nullable: true })
    gender: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: true })
    prime_subscrption_price: number;

    @IsString()
    @Column({ type: 'varchar', length: 20, nullable: false })
    role: string;

    @OneToMany(() => UserCategory, (category) => category.user)
    categories: UserCategory[];

    @OneToMany(() => UserTag, (tag) => tag.user)
    tags: UserTag[];

    @OneToMany(() => Marathon, (marathons) => marathons.author)
    own_marathons?: Marathon[];

    @OneToMany(() => UserMarathon, (marathons) => marathons.participant)
    marathons: UserMarathon[];

    @OneToMany(() => UserBoughtCourse, (boughtCourse) => boughtCourse.student, {
        cascade: true,
    })
    bought_courses: UserBoughtCourse[];

    @OneToMany(() => Course, (course) => course.author)
    courses?: Course[];

    @OneToMany(() => UserFavoriteCourse, (course) => course.user, {
        cascade: true,
    })
    favorite_courses: UserFavoriteCourse[];

    @OneToMany(() => UserFavoriteMarathon, (marathon) => marathon.user, {
        cascade: true,
    })
    favorite_marathons: UserFavoriteMarathon[];

    @OneToMany(() => UserSubscribedMarathon, (marathon) => marathon.user, {
        cascade: true,
    })
    subscribed_marathons: UserSubscribedMarathon[];

    @OneToMany(() => PostLike, (like) => like.user)
    likes?: PostLike[];

    @OneToMany(() => PostDislike, (dislike) => dislike.user)
    dislikes?: PostDislike[];

    @OneToMany(() => Post, (post) => post.author)
    posts?: Post[];

    @OneToMany(() => PostComment, (comment) => comment.user)
    comments: PostComment[];

    @OneToMany(() => PostCommentReply, (comment) => comment.user)
    comments_replies: PostCommentReply[];

    @OneToMany(() => CommentLike, (like) => like.user)
    comments_likes: CommentLike[];

    @OneToMany(() => CommentReplyLike, (like) => like.user)
    comments_replies_likes: CommentReplyLike[];

    @OneToMany(() => ApplicationSubscription, (subscription) => subscription.user)
    application_subscription: ApplicationSubscription;

    @OneToMany(() => Album, (album) => album.user)
    albums: Album[];

    @OneToMany(() => CourseReview, (review) => review.user)
    course_reviews: CourseReview[];

    @OneToMany(() => StageVote, (votes) => votes.voter)
    marathon_votes: StageVote[];

    @OneToMany(() => StageVote, (candidacies) => candidacies.candidate)
    marathon_candidacies: StageVote[];
}
