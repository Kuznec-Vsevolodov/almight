import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Photo } from './photo.entity';
import { Post } from './post.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

@Entity({ name: 'subscriptions', schema: 'public' })
export class Subscription extends GeneralEntity {
    @IsNumber()
    @Column({ name: 'author_id' })
    author: number;

    @IsNumber()
    @Column({ name: 'subscriber_id' })
    subscriber: number;

    @IsString()
    @Column({ type: 'varchar', length: 20, nullable: true })
    status: string;
}