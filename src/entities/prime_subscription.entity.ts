import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';

@Entity({ name: 'prime_subscriptions', schema: 'public' })
export class PrimeSubscription extends GeneralEntity {

    @IsNumber()
    @Column({ name: 'author_id' })
    author: number;

    @IsNumber()
    @Column({ name: 'subscriber_id' })
    subscriber: number;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    price: number;
}