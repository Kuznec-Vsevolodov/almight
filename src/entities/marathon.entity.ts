import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { UserFavoriteMarathon } from './favorite_marathon.entity';
import { MarathonCategory } from './marathon_category.entity';
import { MarathonStage } from './marathon_stage.entity';
import { UserSubscribedMarathon } from './marathon_subscription.entity';
import { MarathonTag } from './marathon_tag.entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';
import { UserMarathon } from './user_marathon.entity';

@Entity({ name: 'marathons', schema: 'public' })
export class Marathon extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.own_marathons)
    @JoinColumn({ name: 'author' })
    author: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @IsString()
    @Column({ type: 'date', nullable: false })
    start_date: string;

    @IsString()
    @Column({ type: 'date', nullable: false })
    end_date: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    price: number;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToOne(() => Photo, (photo) => photo.marathon, {
        cascade: true
    })
    @JoinColumn({ name: 'preview_photo' })
    preview_photo?: Photo;

    @OneToMany(() => UserMarathon, (participants) => participants.marathon)
    participants: UserMarathon[];

    @OneToMany(() => MarathonStage, (stages) => stages.marathon)
    stages: MarathonStage[];

    @OneToMany(() => UserFavoriteMarathon, (users) => users.marathon, {
        cascade: true
    })
    favorits: UserFavoriteMarathon[];

    @OneToMany(() => UserSubscribedMarathon, (users) => users.marathon, {
        cascade: true
    })
    subscribers: UserSubscribedMarathon[];

    @OneToMany(() => MarathonCategory, (category) => category.marathon)
    categories: MarathonCategory[];

    @OneToMany(() => MarathonTag, (tag) => tag.marathon)
    tags: MarathonTag[];
}