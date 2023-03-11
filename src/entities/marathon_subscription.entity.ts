import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Marathon } from './marathon.entity';
import { User } from './user.entity';

@Entity({ name: 'users_subscribed_marathons', schema: 'public' })
export class UserSubscribedMarathon extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.subscribed_marathons)
    @JoinColumn({ name: "user" })
    user: User;

    @ManyToOne(() => Marathon, (marathon) => marathon.subscribers)
    @JoinColumn({ name: "marathon" })
    marathon: Marathon;
}
