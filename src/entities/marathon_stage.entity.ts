import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Marathon } from './marathon.entity';
import { StagePost } from './marathon_stage_post.entity';
import { StageVote } from './stage_vote.entity';

@Entity({ name: 'marathons_stages', schema: 'public' })
export class MarathonStage extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Marathon, (marathon) => marathon.stages)
    @JoinColumn({ name: 'marathon' })
    marathon: Marathon;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @IsString()
    @Column({ type: 'date', nullable: false })
    start_date: string;

    @IsString()
    @Column({ type: 'date', nullable: false })
    end_date: string;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => StageVote, (votes) => votes.stage)
    votes: StageVote[];

    @OneToMany(() => StagePost, (posts) => posts.stage)
    posts: StagePost[];

}