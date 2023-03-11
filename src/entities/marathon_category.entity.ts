import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Category } from './category.entity';
import { Marathon } from './marathon.entity';

@Entity({ name: 'marathons_categories', schema: 'public' })
export class MarathonCategory extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Marathon, (marathon) => marathon.categories)
    @JoinColumn({ name: 'marathon' })
    marathon: Marathon;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.marathons)
    @JoinColumn({ name: 'category' })
    category: Category;
}