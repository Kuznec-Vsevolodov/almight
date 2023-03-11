import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { User } from './user.entity';

@Entity({ name: 'application_subscriptions', schema: 'public' })
export class ApplicationSubscription extends GeneralEntity {
    @IsNumber()
    @ManyToOne(type => User, (user) => user.application_subscription)
    user: User;

    @IsString()
    @Column({ type: 'varchar', length: 255, nullable: false })
    subscription_type: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    price: number;
}