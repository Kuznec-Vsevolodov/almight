import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Album } from '../entities/album.entity';
import { Course } from '../entities/course.entity';
import { UserFavoriteCourse } from '../entities/favorite_course.entity';
import { Photo } from '../entities/photo.entity';
import { Post } from '../entities/post.entity';
import { PrimeSubscription } from '../entities/prime_subscription.entity';
import { Subscription } from '../entities/subscription.entity';
import { User } from '../entities/user.entity';
import { UserBoughtCourse } from '../entities/user_bought_course.entity';
import { FileService, FileType } from '../file/file.service';
import { PhotoService } from '../photo/photo.service';
import { AddToCourseDto } from './dto/add-to-course.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
import { DeleteResult, Like } from 'typeorm';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { UserCategory } from '../entities/user_category.entity';
import { Category } from '../entities/category.entity';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { AddTagDto } from './dto/add-tag.dto';
import { Tag } from '../entities/tag.entity';
import { UserTag } from '../entities/user_tag.entity';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {

    constructor(
        private configService: ConfigService,
        private fileService: FileService,
        private photoService: PhotoService
    ) { }

    private async makeUserAvatar(avatar): Promise<Photo> {
        const photo = new Photo();

        photo.location = await this.fileService.createFile(FileType.IMAGE, avatar);

        return photo;
    }

    async create(dto: CreateUserDto, avatar): Promise<User> {
        const salt = await genSalt(10);
        const user = new User();


        user.full_name = dto.full_name;
        user.short_name = dto.short_name;
        user.last_online = dto.last_online;
        user.gender = dto.gender;
        user.role = dto.role;
        user.date_of_birth = dto.date_of_birth;
        user.prime_subscrption_price = dto.prime_subscrption_price;
        user.avatar = await this.makeUserAvatar(avatar);
        user.password = await hash(dto.password, salt);
        user.email = dto.email;

        return user.save();
    }

    async addCategories(dto: AddCategoriesDto, id): Promise<UserCategory[]> {
        const categories: UserCategory[] = [];

        const user = await User.findOne({ where: { id } });

        for (const category of dto.categories) {
            const savedCategory = await this.createCategory(category, user)
            categories.push(savedCategory);
        }

        return categories;
    }

    async createCategory(categoryData, user): Promise<UserCategory> {
        const category = new UserCategory();

        category.user = user;
        category.category = await Category.findOne({ where: { id: categoryData.category } });

        return category.save();
    }

    async addTag(dto: AddTagDto, id: number): Promise<UserTag> {
        const tag = new UserTag();

        tag.user = await User.findOne({ where: { id } });
        tag.tag = await Tag.findOne({ where: { id: dto.tag } })

        return tag.save();
    }

    async checkTag(dto: AddTagDto, id: number) {
        const tag = await UserTag.getRepository()
            .createQueryBuilder('users_tags')
            .where('users_tags.tag = :id', { id: dto.tag })
            .andWhere('users_tags.user = :user_id', { user_id: id })
            .getOne();

        if (tag) {
            return true;
        }

        return false;
    }

    async getAll(): Promise<User[]> {
        const users = User.getRepository();
        return users.createQueryBuilder("users")
            .innerJoinAndSelect('users.avatar', 'photos')
            .select(['users', 'photos.location'])
            .getMany();
    }

    async getOne(id: number): Promise<User> {
        const user = User.getRepository();
        return user.createQueryBuilder("users")
            .leftJoinAndSelect('users.avatar', 'photos')
            .select(['users', 'photos.location'])
            .where('users.id = :id', { id })
            .getOne();
    }

    async delete(id: number) {
        const user = User.getRepository();
        return await user.createQueryBuilder()
            .delete()
            .from('users')
            .where('id = :id', { id: id })
            .execute();

    }

    async update(dto: CreateUserDto, id: number): Promise<User> {
        const user = User.getRepository();
        const currentUserData = await user.findOne({
            where: { id }
        });

        return user.save({
            ...currentUserData,
            ...dto // updated fields
        });
    }

    async updateAvatar(avatar, id: number): Promise<User> {
        const user = User.getRepository();
        const currentUserData = await user.findOne({
            where: { id }
        });

        return user.save({
            ...currentUserData,
            avatar: await this.makeUserAvatar(avatar)
        });
    }

    async getFriends(id: number): Promise<User[]> {
        const user = User.getRepository();

        return user.createQueryBuilder("users")
            .leftJoinAndSelect('users.avatar', 'photos')
            .leftJoinAndSelect("subscriptions", "subscription", "subscription.author_id = users.id")
            .select(['users', 'photos.location'])
            .where('subscription.subscriber_id = :id', { id })
            .andWhere('subscription.status = :status', { status: 'friend' })
            .getMany();
    }

    async getSubscriptions(id: number): Promise<User[]> {
        const user = User.getRepository();

        return user.createQueryBuilder("users")
            .leftJoinAndSelect('users.avatar', 'photos')
            .leftJoinAndMapOne("users.status", "subscriptions", "subscription", "subscription.author_id = users.id")
            .select(['users', 'photos.location', 'subscription.status'])
            .where('subscription.subscriber_id = :id', { id })
            .getMany();
    }

    async getSubscribers(id: number): Promise<User[]> {
        const user = User.getRepository();

        return user.createQueryBuilder("users")
            .leftJoinAndSelect('users.avatar', 'photos')
            .leftJoinAndMapOne("users.status", "subscriptions", "subscription", "subscription.subscriber_id = users.id")
            .select(['users', 'photos.location', "subscription.status"])
            .where('subscription.author_id = :id', { id })
            .getMany();
    }

    async defineSubscriptionExistance(authorId: number, subscriberId: number): Promise<Boolean> {
        const subscriptionsCount = await Subscription.getRepository()
            .createQueryBuilder('subscriptions')
            .where('subscriber_id = :subscriber_id', { "subscriber_id": subscriberId })
            .andWhere('author_id = :author_id', { "author_id": authorId })
            .getCount();
        if (subscriptionsCount != 0) {
            return true;
        }

        return false;
    }

    async definePrimeSubscriptionExistance(authorId: number, subscriberId: number): Promise<Boolean> {
        const subscriptionsCount = await PrimeSubscription.getRepository()
            .createQueryBuilder('subscriptions')
            .where('subscriber_id = :subscriber_id', { "subscriber_id": subscriberId })
            .andWhere('author_id = :author_id', { "author_id": authorId })
            .getCount();
        if (subscriptionsCount != 0) {
            return true;
        }

        return false;
    }

    async updateSubscriptionStatus(authorId: number, subscriberId: number, status: string) {
        const subscription = Subscription.getRepository();
        const subscriptionData = await subscription.findOne({
            where: { author: authorId, subscriber: subscriberId }
        })

        subscription.save({
            ...subscriptionData,
            status: status
        })
    }

    async createSubscription(authorId: number, subscriberId: number, status: string): Promise<Subscription> {
        const subscription = new Subscription();
        subscription.author = authorId
        subscription.subscriber = subscriberId
        subscription.status = status;

        return subscription.save();
    }

    async subscribe(dto: SubscribeUserDto, subscriber_id: number): Promise<Subscription | String> {
        const subscriberId = subscriber_id;
        const authorId = dto.author_id;
        let status: string = 'subscriber';

        if (await this.defineSubscriptionExistance(authorId, subscriberId)) {
            return "You already have subscription for this user";
        }

        if (await this.defineSubscriptionExistance(subscriberId, authorId)) {
            status = 'friend';
            await this.updateSubscriptionStatus(subscriberId, authorId, status)
        }

        return await this.createSubscription(authorId, subscriberId, status)

    }

    async deleteSubscription(id: number): Promise<DeleteResult> {
        const subscription = Subscription.getRepository();
        return await subscription.createQueryBuilder()
            .delete()
            .from('subscriptions')
            .where('id = :id', { id: id })
            .execute();
    }

    async cancelSubscription(id: number): Promise<DeleteResult> {
        const subscription = Subscription.getRepository();
        const subscriptionData = await subscription.findOne({
            where: { id: id }
        })

        const status: string = 'subscriber';

        console.log(subscriptionData.subscriber);

        if (await this.defineSubscriptionExistance(subscriptionData.subscriber, subscriptionData.author)) {
            await this.updateSubscriptionStatus(subscriptionData.subscriber, subscriptionData.author, status);
        }

        return await this.deleteSubscription(id);
    }

    async createPrimeSubscription(authorId: number, subscriberId: number, price: number) {
        const subscription = new PrimeSubscription();
        subscription.author = authorId
        subscription.subscriber = subscriberId
        subscription.price = price;

        return subscription.save();
    }

    async primeSubscribe(dto: SubscribeUserDto, subscriber_id: number) {
        const subscriberId = subscriber_id;
        const authorId = dto.author_id;

        if (await this.definePrimeSubscriptionExistance(authorId, subscriberId)) {
            return "You already have subscription for this user";
        }

        const user = User.getRepository();
        const currentUserData = await user.findOne({
            where: { id: authorId }
        });

        return await this.createPrimeSubscription(authorId, subscriberId, currentUserData.prime_subscrption_price);

    }

    async cancelPrimeSubscription(id: number): Promise<DeleteResult> {
        const subscription = PrimeSubscription.getRepository();
        return await subscription.createQueryBuilder()
            .delete()
            .from('prime_subscriptions')
            .where('id = :id', { id: id })
            .execute();
    }

    async createAlbum(dto: CreateAlbumDto, photo, id: number) {
        const album = new Album();
        album.user = await User.findOne({ where: { id } });
        album.name = dto.name;
        album.preview_photo = await this.photoService.uploadPhotoForManyToMany(photo);

        return album.save();
    }

    async getAlbums(id: number): Promise<Album[]> {
        const albums = Album.getRepository();

        return await albums.createQueryBuilder('albums')
            .leftJoinAndSelect('albums.preview_photo', 'photos')
            .select(['albums', 'photos.location'])
            //.where("albums.user = :id", { id })
            .getMany()
    }

    async getAlbum(id: number): Promise<Album> {
        const albums = Album.getRepository();

        return albums.createQueryBuilder('albums')
            .leftJoinAndSelect('albums.preview_photo', 'photos')
            .leftJoin('albums.posts', 'posts')
            .loadRelationCountAndMap("albums.posts_quantity", "albums.posts", "posts")
            .select(['albums', 'photos.location'])
            .where('albums.id = :id', { id })
            .getOne()
    }

    async getAlbumPosts(id: number): Promise<Post[]> {
        const posts = Post.getRepository();

        return posts.createQueryBuilder('posts')
            .leftJoin('posts.albums', 'albums_posts')
            .leftJoinAndSelect('posts.preview_photo', 'photos')
            .leftJoinAndSelect('posts.author', 'users')
            .select(['posts', 'photos.location', 'users'])
            .where('albums_posts.album = :id', { id })
            .getMany()
    }

    async updateAlbum(dto: CreateAlbumDto, id: number): Promise<Album> {
        const album = Album.getRepository();
        const albumCurrentData = await Album.findOne({ where: { id } })

        return album.save({
            ...albumCurrentData,
            ...dto
        })
    }

    async updateAlbumPreviewPhoto(photo, id: number): Promise<Album> {
        const album = Album.getRepository();
        const albumCurrentData = await Album.findOne({ where: { id } })

        return album.save({
            ...albumCurrentData,
            preview_photo: await this.photoService.uploadPhotoForManyToMany(photo)
        })
    }

    async buyCourse(dto: AddToCourseDto, id: number): Promise<UserBoughtCourse> {
        const course = new UserBoughtCourse();

        course.course = await Course.findOne({ where: { id: dto.course } })
        course.student = await User.findOne({ where: { id } })

        return course.save();
    }

    async getBoughtCourses(id): Promise<UserBoughtCourse[]> {
        const courses = UserBoughtCourse.getRepository();
        return courses.createQueryBuilder('users_bought_courses')
            .leftJoinAndSelect('users_bought_courses.course', 'courses')
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .select(["courses", "photos.location", 'users_bought_courses'])
            .where('users_bought_courses.student = :id', { id })
            .getMany();

    }

    async getFavoriteCourses(id): Promise<UserFavoriteCourse[]> {
        const courses = UserFavoriteCourse.getRepository();
        return courses.createQueryBuilder('users_favorite_courses')
            .leftJoinAndSelect('users_favorite_courses.course', 'courses')
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .select(["courses", "photos.location", 'users_favorite_courses'])
            .where('users_favorite_courses.user = :id', { id })
            .getMany();
    }

    async getCourses(id): Promise<Course[]> {
        const courses = Course.getRepository();

        return await courses.createQueryBuilder("courses")
            .leftJoinAndSelect('courses.preview_photo', 'photos')
            .leftJoin('courses.reviews', 'courses_reviews')
            .loadRelationCountAndMap("courses.reviews_quantity", "courses.reviews", "courses_reviews")
            .select(["courses", "photos.location"])
            .where("courses.author = :id", { id })
            .getMany();
    }

    async getProVideos(id): Promise<Post[]> {
        const posts = Post.getRepository()
        return posts.createQueryBuilder("posts")
            .leftJoinAndSelect('posts.author', 'users')
            .leftJoinAndSelect('posts.videos', 'videos')
            .leftJoinAndSelect('posts.preview_photo', 'photos')
            .leftJoin('posts.comments', 'posts_comments')
            .leftJoin('posts.likes', 'posts_likes')
            .leftJoin('posts.dislikes', 'posts_dislikes')
            .loadRelationCountAndMap("posts.likes_quantity", "posts.likes", "posts_likes")
            .loadRelationCountAndMap("posts.dislikes_quantity", "posts.dislikes", "posts_dislikes")
            .loadRelationCountAndMap("posts.comments_quantity", "posts.comments", "comment")
            .select(['posts', 'photos.location', 'videos.location', 'users'])
            .where('posts.author = :id', { id })
            .andWhere('posts.is_pro = true')
            .getMany();
    }

    async getPosts(id: number): Promise<Post[]> {
        const posts = Post.getRepository()
        return posts.createQueryBuilder("posts")
            .leftJoinAndSelect('posts.author', 'users')
            .leftJoinAndSelect('posts.videos', 'videos')
            .leftJoinAndSelect('posts.photos', 'photos')
            .leftJoin('posts.comments', 'posts_comments')
            .leftJoin('posts.likes', 'posts_likes')
            .leftJoin('posts.dislikes', 'posts_dislikes')
            .loadRelationCountAndMap("posts.likes_quantity", "posts.likes", "posts_likes")
            .loadRelationCountAndMap("posts.dislikes_quantity", "posts.dislikes", "posts_dislikes")
            .loadRelationCountAndMap("posts.comments_quantity", "posts.comments", "comment")
            .select(['posts', 'photos.location', 'videos.location', 'users'])
            .where('posts.author = :id', { id })
            .andWhere('posts.is_pro = false')
            .getMany();
    }

    async findByName(dto: FindUserDto): Promise<User[]> {
        return await User.find({
            where: { full_name: Like('%' + dto.name + '%') }
        })
    }

    async getCategories(id: number): Promise<Category[]> {
        return Category.getRepository()
            .createQueryBuilder('categories')
            .leftJoinAndSelect('categories.users', 'users_categories')
            .select('categories')
            .where('users_categories.user = :id', { id })
            .getMany()
    }

    private async getUserCategoriesIds(id: number): Promise<number[]> {
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

    async findByCategories(id: number): Promise<User[]> {
        const categories = await this.getUserCategoriesIds(id);

        return await User.getRepository()
            .createQueryBuilder("users")
            .leftJoinAndSelect('users.categories', 'users_categories')
            .innerJoinAndSelect('users.avatar', 'photos')
            .select(['users', 'photos.location'])
            .where('users_categories.category IN (:...categories)', { categories: categories })
            .andWhere('users.id != :id', { id })
            .getMany();
    }

    async findByCategory(dto: FindByCategoryDto): Promise<User[]> {
        return await User.getRepository()
            .createQueryBuilder("users")
            .leftJoinAndSelect('users.categories', 'users_categories')
            .innerJoinAndSelect('users.avatar', 'photos')
            .select(['users', 'photos.location'])
            .andWhere('users_categories.category = :id', { id: dto.category })
            .getMany();
    }


}
