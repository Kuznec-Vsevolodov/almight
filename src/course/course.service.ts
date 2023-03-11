import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { PhotoService } from '../photo/photo.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseReview } from '../entities/course_review.entity';
import { AddCourseReviewDto } from './dto/add-review.dto';
import { CourseLesson } from '../entities/course_lessons.entity';
import { AddToFavoritsDto } from './dto/add-to-favorits.dto';
import { UserFavoriteCourse } from '../entities/favorite_course.entity';
import { Like } from 'typeorm';
import { FindCourseDto } from './dto/find-course.dto';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { CourseCategory } from '../entities/course_category.entity';
import { Category } from '../entities/category.entity';
import { FindByUserCategoriesDto } from './dto/find-by-user-categories.dto';
import { UserCategory } from '../entities/user_category.entity';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { CourseTag } from '../entities/course_tag.entity';
import { Tag } from '../entities/tag.entity';
import { AddTagsDto } from './dto/add-tags.dto';
import { UserTag } from '../entities/user_tag.entity';
import { FindByTagDto } from './dto/find-by-tag.dto';
import { TagService } from '../tag/tag.service';
import { Post } from '../entities/post.entity';
import { AddCourseLessonDto } from './dto/add-lesson.dto';
import { UserBoughtCourse } from '../entities/user_bought_course.entity';

@Injectable()
export class CourseService {

    constructor(
        private photoService: PhotoService,
        private tagService: TagService
    ) { }

    async create(dto: CreateCourseDto, preview, user_id: number) {
        const course = new Course();

        course.author = await User.findOne({ where: { id: user_id } });
        course.name = dto.name;
        course.description = dto.description;
        course.price = dto.price;
        course.preview_photo = await this.photoService.uploadPhotoForPreviewOrAvatar(preview);

        return course.save();
    }

    async addCategories(dto: AddCategoriesDto, id) {
        const categories: CourseCategory[] = [];

        const course = await Course.findOne({ where: { id } });

        for (const category of dto.categories) {
            const savedCategory = await this.createCategory(category, course)
            categories.push(savedCategory);
        }

        return categories;
    }

    async createCategory(categoryData, course) {
        const category = new CourseCategory();

        category.course = course;
        category.category = await Category.findOne({ where: { id: categoryData.category } });

        return category.save();
    }

    async createTag(tagData, course) {
        const tag = new CourseTag();

        tag.course = course;
        tag.tag = await Tag.findOne({ where: { id: tagData.tag } });

        return tag.save();
    }

    async addTags(dto: AddTagsDto, id) {
        const tags: CourseTag[] = [];

        const course = await Course.findOne({ where: { id } });

        for (const tag of dto.tags) {
            const savedTag = await this.createTag(tag, course)
            tags.push(savedTag);
        }

        return tags;
    }

    async update(dto: UpdateCourseDto, id) {
        const course = Course.getRepository();
        const currentCourseData = await course.findOne({
            where: { id }
        });

        return course.save({
            ...currentCourseData,
            ...dto
        })
    }

    async updatePreviewPhoto(preview, id) {
        const course = Course.getRepository();
        const currentCourseData = await course.findOne({
            where: { id }
        });

        return await course.save({
            ...currentCourseData,
            preview_photo: await this.photoService.uploadPhotoForPreviewOrAvatar(preview)
        })
    }

    async getAll(skip: number) {
        const courses = Course.getRepository();

        return await courses.createQueryBuilder("courses")
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .select(["courses", "photos.location", 'courses_reviews.score'])
            .skip(skip)
            .take(10)
            .getMany();
    }

    async getOne(id) {
        const courses = Course.getRepository();

        return await courses.createQueryBuilder("courses")
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .leftJoinAndSelect('courses.author', 'users')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .loadRelationCountAndMap("courses.students_quantity", "courses.students", "users_bought_courses")
            .loadRelationCountAndMap("courses.lessons_quantity", "courses.lessons", "courses_lessons")
            .select(["courses", "photos.location", 'users.id', 'users.full_name'])
            .where('courses.id = :id', { id })
            .getOne();
    }

    async getLessons(id) {
        const lessons = CourseLesson.getRepository();

        return await lessons.createQueryBuilder("courses_lessons")
            .leftJoinAndSelect('courses_lessons.lesson', 'posts')
            .leftJoinAndSelect('posts.videos', 'videos')
            .select(['courses_lessons', 'posts.id', 'posts.name', 'videos.duration'])
            .where('courses_lessons.course = :id', { id })
            .getOne();
    }

    async getReviews(id, skip: number) {
        return await CourseReview.getRepository()
            .createQueryBuilder('courses_reviews')
            .leftJoinAndSelect('courses_reviews.user', 'users')
            .select(['courses_reviews', 'users'])
            .where('courses_reviews.course = :id', { id })
            .skip(skip)
            .take(10)
            .getMany();
    }

    async addReview(dto: AddCourseReviewDto, id) {
        const review = new CourseReview();

        review.text = dto.text;
        review.user = await User.findOne({ where: { id: dto.user } });
        review.score = dto.score;
        review.course = await Course.findOne({ where: { id } })

        this.changeAvaregeUserScore(id, dto.score)

        return review.save();
    }

    async addLesson(dto: AddCourseLessonDto, id) {
        const lesson = new CourseLesson();

        lesson.lesson = await Post.findOne({ where: { id: dto.post } });
        lesson.course = await Course.findOne({ where: { id } })

        return lesson.save();
    }

    async deleteLesson(lesson_id) {

        const lesson = CourseLesson.getRepository();
        return await lesson.createQueryBuilder()
            .delete()
            .from('courses_lessons')
            .where('id = :id', { id: lesson_id })
            .execute();
    }

    async changeAvaregeUserScore(id, new_score) {
        const course = await Course.findOne({ where: { id } });

        const reviews_count = await CourseReview.getRepository()
            .createQueryBuilder('courses_reviews')
            .select('courses_reviews.score')
            .where('course = :id', { id })
            .getCount();

        course.average_rating = Number(((course.average_rating * reviews_count + new_score) / (reviews_count + 1)).toFixed(1));
        return course.save()
    }

    async delete(id) {
        const course = Course.getRepository();
        return await course.createQueryBuilder()
            .delete()
            .from('courses')
            .where('id = :id', { id: id })
            .execute();
    }

    async addToFavorits(user_id: number, id: number) {
        const favoriteCourse = new UserFavoriteCourse();

        favoriteCourse.user = await User.findOne({ where: { id: user_id } });
        favoriteCourse.course = await Course.findOne({ where: { id } })

        return favoriteCourse.save();
    }

    async deleteFromFavorits(user_id: number, id: number) {
        const favoriteCourse = UserFavoriteCourse.getRepository();
        return await favoriteCourse.createQueryBuilder()
            .delete()
            .from('users_favorite_courses')
            .where('course = :id', { id: id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }

    async findByName(dto: FindCourseDto): Promise<Course[]> {
        return await Course.find({
            where: { name: Like('%' + dto.name + '%') }
        })
    }

    async findByCategory(dto: FindByCategoryDto, skip): Promise<Course[]> {
        return await Course.getRepository()
            .createQueryBuilder('courses')
            .leftJoinAndSelect('courses.categories', 'courses_categories')
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .select(["courses", "photos.location"])
            .andWhere('courses_categories.category = :id', { id: dto.category })
            .orderBy('courses.average_rating')
            .skip(skip)
            .take(10)
            .getMany();
    }

    private async getUserCategories(id: number): Promise<number[]> {
        const userCategories = await UserCategory.getRepository()
            .createQueryBuilder('users_categories')
            .select('category')
            .where('users_categories.user = :id', { id: id })
            .getRawMany();

        const categories = [];

        for (const category of userCategories) {
            categories.push(category.category);
        }

        return categories;
    }

    private async getUserTagsByType(id: number, type) {
        const userTags = await UserTag.getRepository()
            .createQueryBuilder('users_tags')
            .leftJoinAndSelect('users_tags.tag', 'tags')
            .select('tag')
            .where('users_tags.user = :id', { id: id })
            .andWhere('tags.type = :type', { type })
            .getRawMany();

        const tags = [];

        for (const tag of userTags) {
            tags.push(tag.tag);
        }

        return tags;
    }

    async findByUserCategories(dto: FindByUserCategoriesDto, skip: number) {
        const categories = await this.getUserCategories(dto.user);
        const tags = await this.getUserTagsByType(dto.user, "language");

        if (categories.length > 0) {
            return await Course.getRepository()
                .createQueryBuilder('courses')
                .leftJoinAndSelect('courses.categories', 'courses_categories')
                .leftJoinAndSelect('courses.tags', 'courses_tags')
                .leftJoinAndSelect('courses.preview_photo', 'photos')
                .leftJoin('courses.reviews', 'courses_reviews')
                .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
                .select(["courses", "photos.location"])
                .andWhere('courses_categories.category IN (:...categories)', { categories })
                .andWhere('courses_tags.tag IN (:...tags)', { tags })
                .skip(skip)
                .take(10)
                .getMany();
        }
        return [];
    }

    async findByTag(dto: FindByTagDto, skip: number) {
        const tags = await this.tagService.findByName(dto);

        if (tags.length > 0) {

            const tagsIds: number[] = [];

            for (const tag of tags) {
                tagsIds.push(tag.tags_id);
            }

            return await Course.getRepository()
                .createQueryBuilder('courses')
                .leftJoinAndSelect('courses.tags', 'courses_tags')
                .leftJoinAndSelect('courses.preview_photo', 'photos')
                .leftJoin('courses.reviews', 'courses_reviews')
                .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
                .select(["courses", "photos.location"])
                .andWhere('courses_tags.tag IN (:...tags)', { tags: tagsIds })
                .skip(skip)
                .take(10)
                .getMany();
        }
        return []
    }

    async checkAuthor(user_id, id) {
        const user = user_id;
        const course = await Course.getRepository()
            .createQueryBuilder("courses")
            .select("courses")
            .where("courses.author = :user_id", { user_id: user })
            .andWhere("courses.id = :id", { id: id })
            .getOne();

        if (course) {
            return true;
        }
        return false
    }

    async buyCourse(user_id: number, id: number) {
        const course = new UserBoughtCourse();

        course.course = await Course.findOne({ where: { id } })
        course.student = await User.findOne({ where: { id: user_id } })

        return course.save();
    }
}
