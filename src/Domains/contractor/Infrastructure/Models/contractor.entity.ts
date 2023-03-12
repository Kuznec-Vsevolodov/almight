import { IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../../Shared/BaseEntity/baseEntity';
import { Assignment } from 'src/Domains/assignment/Infrastructure/Models/assignment.entity'; 
import { Photo } from '../../../photo/Infrastructure/Models/photo.entity';
import { Rating } from '../../../../entities/rating.entity';
import { Service } from '../../../service/Infrastructure/Models/service.entity';
import { User } from '../../../../entities/user.entity';

@Entity({ name: 'contractors', schema: 'public' })
export class Contractor extends BaseEntity {
    @OneToOne(() => User, (user) => user.contractor, {
        cascade: true
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @IsString()
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @IsString()
    @Column({ type: 'varchar', length: 250, nullable: true })
    @MinLength(8)
    address: string;

    @IsEmail()
    @Column({ type: 'varchar', length: 250, nullable: true, unique: true })
    email: string;

    @IsEmail()
    @Column({ type: 'varchar', length: 250, nullable: true, unique: true })
    phone_number: string;

    @IsNumber()
    @Column({ type: "float", nullable: true, default: 0 })
    average_rating: number;

    @OneToOne(() => Photo, (photo) => photo.contractor, {
        cascade: true
    })
    @JoinColumn({ name: 'avatar_id' })
    avatar?: Photo;

    @ManyToOne(() => Service, (service) => service.contractors)
    service?: Service;

    @OneToMany(() => Assignment, (assignment) => assignment.contractor)
    assignments?: Assignment[];

    @OneToMany(() => Rating, (rating) => rating.contractor)
    ratings?: Rating[];
}
