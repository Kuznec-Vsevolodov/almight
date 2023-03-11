import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Album } from './album.entity';
import { AlbumPost } from './album_post.entity';
import { PostComment } from './comment.entity';
import { CourseLesson } from './course_lessons.entity';
import { Doc } from './doc.entity';
import { StagePost } from './marathon_stage_post.entity';
import { Photo } from './photo.entity';
import { PostCategory } from './post_category.entity';
import { PostDislike } from './post_dislike.entity';
import { PostLike } from './post_like.entity';
import { PostTag } from './post_tag.entity';
import { User } from './user.entity';
import { Video } from './video.entity';

@Entity({ name: 'posts', schema: 'public' })
export class Post extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    views: number;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @IsBoolean()
    @Column({ type: 'bool', default: false })
    is_pro: boolean;

    @IsBoolean()
    @Column({ type: 'bool', default: false })
    is_course: boolean;

    @IsBoolean()
    @Column({ type: 'bool', default: false })
    is_premium: boolean;

    @IsNumber()
    @OneToOne(type => Photo, (photo) => photo.post, {
        cascade: true
    })
    @JoinColumn({ name: 'preview_photo' })
    preview_photo?: Photo;

    @ManyToMany(() => Photo, {
        cascade: true
    })
    @JoinTable({ name: "post_photos" })
    photos?: Photo[];

    @ManyToMany(() => Video)
    @JoinTable({ name: "post_videos" })
    videos?: Video[];

    @ManyToMany(() => Doc)
    @JoinTable({ name: "post_docs" })
    docs?: Doc[];

    @OneToMany(() => PostLike, (like) => like.post)
    likes?: PostLike[];

    @OneToMany(() => PostDislike, (dislike) => dislike.post)
    dislikes?: PostDislike[];

    @OneToMany(() => PostComment, (comment) => comment.post)
    comments?: PostComment[];

    @OneToMany(() => AlbumPost, (album) => album.post)
    albums: AlbumPost[];

    @OneToMany(() => CourseLesson, (course) => course.lesson)
    courses: CourseLesson[];

    @OneToOne(() => StagePost, (stage) => stage.post)
    stage: StagePost;

    @OneToMany(() => PostCategory, (category) => category.post)
    categories: PostCategory[];

    @OneToMany(() => PostTag, (tag) => tag.post)
    tags: PostTag[];
}
