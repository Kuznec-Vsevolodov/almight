import { IsString } from 'class-validator';
import { Column, Entity, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Album } from './album.entity';
import { Course } from './course.entity';
import { Marathon } from './marathon.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'photos', schema: 'public' })
export class Photo extends GeneralEntity {
    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @OneToOne(() => User, (user) => user.avatar)
    user: User

    @OneToOne(() => Post, (post) => post.preview_photo)
    post: Post

    @OneToOne(() => Album, (album) => album.preview_photo)
    album: Album

    @OneToOne(() => Course, (course) => course.preview_photo)
    course: Course

    @OneToOne(() => Marathon, (marathon) => marathon.preview_photo)
    marathon: Marathon
}
