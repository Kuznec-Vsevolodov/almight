import { IsEmail, IsString, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/Shared/BaseEntity/baseEntity';
import { Service } from '../../../service/Infrastructure/Models/service.entity';
import { Assignment } from 'src/Domains/assignment/Infrastructure/Models/assignment.entity';
import { Contractor } from '../../../contractor/Infrastructure/Models/contractor.entity';
import { Rating } from '../../../../entities/rating.entity';

export enum UserRole {
    CLIENT = "client",
    CONTRACTOR = "contractor",
}

@Entity({ name: 'users', schema: 'public' })
export class User extends BaseEntity {
    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    full_name: string;

    @IsString()
    @Column({ type: 'varchar', length: 250, nullable: true })
    @MinLength(8)
    password: string;

    @IsEmail()
    @Column({ type: 'varchar', length: 250, nullable: true, unique: true })
    email: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CLIENT
    })
    role: UserRole;

    @OneToOne(() => Contractor, (contractor) => contractor.user)
    contractor: Contractor;

    @OneToMany(() => Service, (service) => service.author)
    services?: Service[];

    @OneToMany(() => Assignment, (assingment) => assingment.client)
    assignments?: Assignment[];

    @OneToMany(() => Rating, (rating) => rating.client)
    ratings?: Rating[];

}
