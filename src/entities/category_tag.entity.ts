import { IsNumber } from 'class-validator';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../baseEntity';
import { Category } from './category.entity';
import { Course } from './course.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'categories_tags', schema: 'public' })
export class CategoryTag extends GeneralEntity {
    @IsNumber()
    @ManyToOne(() => Tag, (tag) => tag.categories)
    @JoinColumn({ name: 'tag' })
    tag: Tag;

    @IsNumber()
    @ManyToOne(() => Category, (category) => category.tags)
    @JoinColumn({ name: 'category' })
    category: Category;
}