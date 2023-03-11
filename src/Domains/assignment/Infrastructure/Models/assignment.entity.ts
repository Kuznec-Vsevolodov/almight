import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../Shared/BaseEntity/baseEntity';
import { Contractor } from './contractor.entity';
import { Doc } from './doc.entity';
import { Payment } from './payment.entity';
import { Service } from './service.entity';
import { User } from './user.entity';

export enum AssignmentStatus {
    ACCEPTED = "accepted",
    IN_PROGRESS = "in progress",
    COMPLETED = "completed",
    CANCELED = "canceled",
}

@Entity({ name: 'assignments', schema: 'public' })
export class Assignment extends BaseEntity {
    @ManyToOne(() => User, (user) => user.assignments)
    @JoinColumn({ name: 'client_id' })
    client: User;

    @ManyToOne(() => Contractor, (contractor) => contractor.assignments)
    @JoinColumn({ name: 'contractor_id' })
    contractor: Contractor;

    @ManyToOne(() => Service, (service) => service.assignments)
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @IsString()
    @Column({ type: 'text', nullable: true })
    location_latitude: string;

    @IsString()
    @Column({ type: 'text', nullable: true })
    location_longitude: string;

    @IsString()
    @Column({ type: 'text', nullable: true })
    contractor_location_latitude: string;

    @IsString()
    @Column({ type: 'text', nullable: true })
    contractor_location_longitude: string;

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    payment_amount: number;

    @IsString()
    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        type: "enum",
        enum: AssignmentStatus,
        default: AssignmentStatus.ACCEPTED
    })
    status: AssignmentStatus;

    @ManyToMany(() => Doc)
    @JoinTable({ name: "assignment_docs" })
    docs?: Doc[];

    @OneToOne(() => Payment, (payment) => payment.assignment)
    payment: Payment;
}
