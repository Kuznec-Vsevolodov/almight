import { IsNumber } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Assignment } from './assignment.entity';

@Entity({ name: 'payments', schema: 'public' })
export class Payment extends BaseEntity {

    @IsNumber()
    @Column({ type: 'integer', nullable: false })
    payment_amount: number;

    @OneToOne(() => Assignment, (assignment) => assignment.payment, {
        cascade: true
    })
    @JoinColumn({ name: 'assignment_id' })
    assignment?: Assignment;
}