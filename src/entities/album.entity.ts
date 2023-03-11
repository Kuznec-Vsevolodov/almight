import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { AlbumPost } from './album_post.entity';
import { Photo } from './photo.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'albums', schema: 'public' })
export class Album extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.albums)
    @JoinColumn({ name: 'user' })
    user: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @OneToOne(() => Photo, (photo) => photo.album)
    @JoinColumn({ name: 'preview_photo' })
    preview_photo: Photo;

    @OneToMany(() => AlbumPost, (post) => post.album)
    posts: AlbumPost[]
}