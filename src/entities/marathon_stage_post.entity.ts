import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Course } from './course.entity';
import { MarathonStage } from './marathon_stage.entity';
import { Post } from './post.entity';

@Entity({ name: 'stages_posts', schema: 'public' })
export class StagePost extends GeneralEntity {
    @OneToOne(() => Post, (post) => post.stage, { cascade: true })
    @JoinColumn({ name: "post" })
    post: Post;

    @ManyToOne(() => MarathonStage, (stage) => stage.posts)
    @JoinColumn({ name: "stage" })
    stage: MarathonStage;
}