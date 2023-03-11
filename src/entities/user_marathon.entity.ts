import { IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Marathon } from './marathon.entity';
import { User } from './user.entity';

@Entity({ name: 'users_marathons', schema: 'public' })
export class UserMarathon extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.marathons)
    @JoinColumn({ name: "participant" })
    participant: User;

    @IsNumber()
    @Column({ type: "float", default: 0 })
    average_rating: number;

    @ManyToOne(() => Marathon, (marathon) => marathon.participants)
    @JoinColumn({ name: "marathon" })
    marathon: Marathon;
}
