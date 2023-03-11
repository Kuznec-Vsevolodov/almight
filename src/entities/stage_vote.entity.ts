import { IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { MarathonStage } from './marathon_stage.entity';
import { User } from './user.entity';

@Entity({ name: 'stages_votes', schema: 'public' })
export class StageVote extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => User, (user) => user.marathon_votes)
    @JoinColumn({ name: 'voter' })
    voter: User;

    @IsNumber()
    @ManyToOne(() => User, (user) => user.marathon_candidacies)
    @JoinColumn({ name: 'candidate' })
    candidate: User;

    @IsNumber()
    @Column({ type: "integer", nullable: false })
    score: number;

    @IsNumber()
    @ManyToOne(() => MarathonStage, (stage) => stage.votes)
    @JoinColumn({ name: 'stage' })
    stage: MarathonStage;
}