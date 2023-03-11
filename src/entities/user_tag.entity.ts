import { IsDate, IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { User } from './user.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'users_tags', schema: 'public' })
export class UserTag extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.users)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @Column({ type: "float", default: 1 })
    priority_ratio: number;

    @IsDate()
    @Column({ type: "date", default: new Date() })
    last_interraction: string;

    @IsNumber()
    @Column({ type: "float", default: 1 })
    tendention: number;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.tags)
    @JoinColumn({ name: 'user' })
    user: User;

}