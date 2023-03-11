import { BaseEntity as TypeOrmBaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from 'typeorm'

export class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ name: "created_at", nullable: true })
    createdAt?: Date

    @CreateDateColumn({ name: "updated_at", nullable: true })
    updatedAt?: Date
} 