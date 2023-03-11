import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, Unique } from 'typeorm'

export class GeneralEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ name: "created_at", nullable: true })
    createdAt?: Date

    @CreateDateColumn({ name: "updated_at", nullable: true })
    updatedAt?: Date
} 