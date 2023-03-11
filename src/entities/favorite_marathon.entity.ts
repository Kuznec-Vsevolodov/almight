import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Marathon } from './marathon.entity';
import { User } from './user.entity';

@Entity({ name: 'users_favorite_marathons', schema: 'public' })
export class UserFavoriteMarathon extends GeneralEntity {
    @ManyToOne(() => User, (user) => user.favorite_marathons)
    @JoinColumn({ name: "user" })
    user: User;

    @ManyToOne(() => Marathon, (marathon) => marathon.favorits)
    @JoinColumn({ name: "marathon" })
    marathon: Marathon;
}
