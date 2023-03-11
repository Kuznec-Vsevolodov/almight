import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Album } from './album.entity';
import { Post } from './post.entity';

@Entity({ name: 'albums_posts', schema: 'public' })
export class AlbumPost extends GeneralEntity {

    @ManyToOne(() => Album, (album) => album.posts)
    @JoinColumn({ name: 'album' })
    album: Album

    @ManyToOne(() => Post, (post) => post.albums)
    @JoinColumn({ name: 'post' })
    post: Post;
}