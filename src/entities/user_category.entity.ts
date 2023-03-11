import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity({ name: 'users_categories', schema: 'public' })
export class UserCategory extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => User, (user) => user.categories)
    @JoinColumn({ name: 'user' })
    user: User;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.users)
    @JoinColumn({ name: 'category' })
    category: Category;
}