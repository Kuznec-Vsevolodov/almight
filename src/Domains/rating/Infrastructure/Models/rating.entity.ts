import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import { BaseEntity } from '../../../../Shared/BaseEntity/baseEntity';
import { Contractor } from '../../../contractor/Infrastructure/Models/contractor.entity';
import { User } from '../../../user/Infrastructure/Models/user.entity';


@Entity({ name: 'assignments', schema: 'public' })
export class Rating extends BaseEntity {
    @ManyToOne(() => User, (user) => user.ratings)
    @JoinColumn({ name: 'client_id' })
    client: User;

    @ManyToOne(() => Contractor, (contractor) => contractor.ratings)
    @JoinColumn({ name: 'contractor_id' })
    contractor: Contractor;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    value: number;

    @IsString()
    @Column({ type: 'text', nullable: true })
    comment: string;
}