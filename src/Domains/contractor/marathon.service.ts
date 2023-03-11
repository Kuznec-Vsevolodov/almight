import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserFavoriteMarathon } from '../entities/favorite_marathon.entity';
import { Marathon } from '../entities/marathon.entity';
import { MarathonStage } from '../entities/marathon_stage.entity';
import { StagePost } from '../entities/marathon_stage_post.entity';
import { Post } from '../entities/post.entity';
import { StageVote } from '../entities/stage_vote.entity';
import { User } from '../entities/user.entity';
import { UserMarathon } from '../entities/user_marathon.entity';
import { FileService } from '../file/file.service';
import { PhotoService } from '../photo/photo.service';
import { AddPostToStageDto } from './dto/add-post-to-stage.dto';
import { AddStagesDto } from './dto/add-stages.dto';
import { AddToFavoritsDto } from './dto/add-to-favorits.dto';
import { AddUserDto } from './dto/add-user.dto';
import { CheckUserPositionDto } from './dto/check-user-position.dto';
import { CreateMarathonDto } from './dto/create-marathon.dto';
import { FindMarathonDto } from './dto/find-marathon.dto';
import { RateUserDto } from './dto/rate-user.dto';
import { UpdateMarathonDto } from './dto/update-marathon.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Like } from 'typeorm';
import { AddCategoriesDto } from './dto/add-categories.dto';
import { MarathonCategory } from '../entities/marathon_category.entity';
import { Category } from '../entities/category.entity';
import { FindByUserCategoriesDto } from './dto/find-by-user-categories.dto';
import { UserCategory } from '../entities/user_category.entity';
import { FindByCategoryDto } from './dto/find-by-category.dto';
import { MarathonTag } from '../entities/marathon_tag.entity';
import { Tag } from '../entities/tag.entity';
import { AddTagsDto } from './dto/add-tags.dto';
import { UserTag } from '../entities/user_tag.entity';
import { FindByTagDto } from './dto/find-by-tag.dto';
import { TagService } from '../tag/tag.service';
import { UserSubscribedMarathon } from '../entities/marathon_subscription.entity';

@Injectable()
export class MarathonService {

    constructor(
        private photoService: PhotoService,
        private tagService: TagService
    ) { }

    async create(dto: CreateMarathonDto, preview, user_id) {
        const marathon = new Marathon();

        marathon.author = await User.findOne({ where: { id: user_id } });
        marathon.name = dto.name;
        marathon.start_date = dto.start_date;
        marathon.end_date = dto.end_date;
        marathon.description = dto.description;
        marathon.price = dto.price;
        marathon.preview_photo = await this.photoService.uploadPhotoForPreviewOrAvatar(preview);

        return marathon.save();
    }

    async addCategories(dto: AddCategoriesDto, id) {
        const categories: MarathonCategory[] = [];

        const marathon = await Marathon.findOne({ where: { id } });

        for (const category of dto.categories) {
            const savedCategory = await this.createCategory(category, marathon)
            categories.push(savedCategory);
        }

        return categories;
    }

    async createCategory(categoryData, marathon) {
        const category = new MarathonCategory();

        category.marathon = marathon;
        category.category = await Category.findOne({ where: { id: categoryData.category } });

        return category.save();
    }

    async createTag(tagData, marathon) {
        const tag = new MarathonTag();

        tag.marathon = marathon;
        tag.tag = await Tag.findOne({ where: { id: tagData.tag } });

        return tag.save();
    }

    async addTags(dto: AddTagsDto, id) {
        const tags: MarathonTag[] = [];

        const marathon = await Marathon.findOne({ where: { id } });

        for (const tag of dto.tags) {
            const savedTag = await this.createTag(tag, marathon)
            tags.push(savedTag);
        }

        return tags;
    }

    async update(dto: UpdateMarathonDto, id) {
        const marathon = Marathon.getRepository();
        const currentmarathonData = await marathon.findOne({
            where: { id }
        });

        return marathon.save({
            ...currentmarathonData,
            ...dto
        })
    }

    async updatePreviewPhoto(preview, id) {
        const marathon = Marathon.getRepository();
        const currentmarathonData = await marathon.findOne({
            where: { id }
        });

        return await marathon.save({
            ...currentmarathonData,
            preview_photo: await this.photoService.uploadPhotoForPreviewOrAvatar(preview)
        })
    }

    async delete(id) {
        const marathon = Marathon.getRepository();
        return await marathon.createQueryBuilder()
            .delete()
            .from('marathons')
            .where('id = :id', { id: id })
            .execute();
    }

    async getAll(skip: number) {
        const marathons = Marathon.getRepository();

        return await marathons.createQueryBuilder("marathons")
            .leftJoinAndSelect('marathons.preview_photo', 'photos')
            .leftJoin('marathons.participants', 'useres')
            .loadRelationCountAndMap("marathons.participants_quantity", "marathons.participants", "users")
            .loadRelationCountAndMap("marathons.stages_quantity", "marathons.stages", "marathons.marathons_stages")
            .select(["marathons", "photos.location"])
            .skip(skip)
            .take(10)
            .getMany();
    }

    async getQuantityOfEndedStages(id: number) {
        return MarathonStage.getRepository()
            .createQueryBuilder('marathons_stages')
            .where('marathon = :id', { id })
            .andWhere('end_date < :date', { date: new Date() })
            .getCount()
    }

    async getUsersDesc(id) {
        const marathon = await UserMarathon.getRepository();

        return await marathon.createQueryBuilder('users_marathons')
            .where('marathon = :id', { id })
            .orderBy('average_rating', "DESC")
    }

    async getUserPosition(dto: CheckUserPositionDto, id: number) {
        const marathonUsersList = await (await this.getUsersDesc(id)).getRawMany();
        return marathonUsersList.findIndex(user => user.users_marathons_participant == dto.user) + 1;
    }

    async AddUser(dto: AddUserDto, id: number) {
        const marathonUser = new UserMarathon();
        marathonUser.participant = await User.findOne({ where: { id: dto.user } });
        marathonUser.marathon = await Marathon.findOne({ where: { id } });

        return marathonUser.save();
    }

    async getWinner(id) {
        return await (await this.getUsersDesc(id))
            .leftJoinAndSelect('users_marathons.participant', 'users')
            .getOne();
    }

    async getUsersTop(id, skip: number) {
        return await (await this.getUsersDesc(id))
            .leftJoinAndSelect('users_marathons.participant', 'users')
            .leftJoinAndSelect('users.avatar', 'photos')
            .select(['users_marathons', 'users', 'photos.location'])
            .skip(skip)
            .take(20)
            .getMany();
    }

    async rateUser(dto: RateUserDto, stage_id, voter) {
        const vote = new StageVote()
        vote.candidate = await User.findOne({ where: { id: dto.candidate } });
        vote.voter = await User.findOne({ where: { id: voter } });
        vote.score = dto.score;
        vote.stage = await MarathonStage.findOne({ where: { id: stage_id } });

        this.changeAvarageUserRating(dto.candidate, dto.score, stage_id);

        return vote.save();

    }

    async changeAvarageUserRating(id, new_score, stage_id) {
        const user = await UserMarathon.findOne({ where: { participant: id } });

        const reviews_count = await StageVote.getRepository()
            .createQueryBuilder('stages_votes')
            .where('candidate = :id', { id: id })
            .andWhere('stage = :stage_id', { stage_id })
            .getCount();

        user.average_rating = Number(((user.average_rating * reviews_count + new_score) / (reviews_count + 1)).toFixed(3));
        return user.save()
    }

    async getStages(id) {
        const stages = await MarathonStage.getRepository();
        return await stages.createQueryBuilder('marathons_stages')
            .where("marathon = :id", { id })
            .getMany();
    }


    async addStages(dto: AddStagesDto, id) {
        let marathonStages: MarathonStage[] = [];

        for (const stage of dto.stages) {
            const savedStage = await this.createStage(stage, id)
            marathonStages.push(savedStage);
        }

        return marathonStages;
    }

    async createStage(stageData, id) {
        const stage = new MarathonStage();

        stage.description = stageData.description;
        stage.name = stageData.name;
        stage.start_date = stageData.start_date;
        stage.end_date = stageData.end_date;
        stage.marathon = await Marathon.findOne({ where: { id } })

        return stage.save();
    }

    async addPostToStage(dto: AddPostToStageDto, stage_id) {
        const stagePost = new StagePost();
        stagePost.post = await Post.findOne({ where: { id: dto.post } })
        stagePost.stage = await MarathonStage.findOne({ where: { id: stage_id } });

        return stagePost.save();
    }

    async getStagePosts(stage_id: number, skip: number) {
        const posts = StagePost.getRepository();

        return await posts.createQueryBuilder('stages_posts')
            .leftJoinAndSelect('stages_posts.post', 'posts')
            .leftJoinAndSelect('posts.author', 'users')
            .leftJoinAndSelect('posts.videos', 'videos')
            .leftJoinAndSelect('posts.photos', 'photos')
            .leftJoin('posts.comments', 'posts_comments')
            .leftJoin('posts.likes', 'posts_likes')
            .leftJoin('posts.dislikes', 'posts_dislikes')
            .loadRelationCountAndMap("posts.likes_quantity", "posts.likes", "posts_likes")
            .loadRelationCountAndMap("posts.dislikes_quantity", "posts.dislikes", "posts_dislikes")
            .loadRelationCountAndMap("posts.comments_quantity", "posts.comments", "comment")
            .select(['stages_posts', 'posts', 'photos.location', 'videos.location', 'users'])
            .where("stages_posts.stage = :id", { id: stage_id })
            .skip(skip)
            .take(10)
            .getMany();
    }

    async updateStage(dto: UpdateStageDto, id: number) {
        const stage = MarathonStage.getRepository();
        const currentStageData = await stage.findOne({
            where: { id }
        });

        return stage.save({
            ...currentStageData,
            ...dto
        })
    }

    async deletePostFromStage(post_id: number) {
        const post = StagePost.getRepository();
        return await post.createQueryBuilder()
            .delete()
            .from('stages_posts')
            .where('post = :id', { id: post_id })
            .execute();
    }

    async checkUser(dto: CheckUserPositionDto, id) {
        const marathon = await UserMarathon.getRepository();

        const user = await marathon.createQueryBuilder('users_marathons')
            .where("participant = :userId", { userId: dto.user })
            .andWhere("marathon = :id", { id })
            .getOne();

        if (user) {
            return true;
        }
        return false;
    }

    async checkUserRate(user_id: number, stage_id) {
        const stageVote = await StageVote.getRepository();

        const vote = await stageVote.createQueryBuilder('stages_votes')
            .where("voter = :userId", { userId: user_id })
            .andWhere("stage = :id", { id: stage_id })
            .getOne();

        if (vote) {
            return true;
        }
        return false
    }

    async addToFavorits(user_id: number, id: number) {
        const favoriteMarathon = new UserFavoriteMarathon();

        favoriteMarathon.user = await User.findOne({ where: { id: user_id } });
        favoriteMarathon.marathon = await Marathon.findOne({ where: { id } })

        return favoriteMarathon.save();
    }

    async subscribeOnMarathon(user_id: number, id: number) {
        const subscribedMarathon = new UserSubscribedMarathon();

        subscribedMarathon.user = await User.findOne({ where: { id: user_id } });
        subscribedMarathon.marathon = await Marathon.findOne({ where: { id } })

        return subscribedMarathon.save();
    }

    async deleteFromFavorits(user_id: number, id: number) {
        const favoriteMarathon = UserFavoriteMarathon.getRepository();
        return await favoriteMarathon.createQueryBuilder()
            .delete()
            .from('users_favorite_marathons')
            .where('marathon = :id', { id: id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }

    async findByName(dto: FindMarathonDto): Promise<Marathon[]> {
        return await Marathon.find({
            where: { name: Like('%' + dto.name + '%') }
        })
    }

    async findByCategory(dto: FindByCategoryDto, skip: number): Promise<Marathon[]> {
        return await Marathon.getRepository()
            .createQueryBuilder('marathons')
            .leftJoinAndSelect('marathons.categories', 'marathons_categories')
            .leftJoinAndSelect('marathons.preview_photo', 'photos')
            .leftJoin('marathons.participants', 'users')
            .loadRelationCountAndMap("marathons.participants_quantity", "marathons.participants", "users")
            .loadRelationCountAndMap("marathons.stages_quantity", "marathons.stages", "marathons.marathons_stages")
            .select(["marathons", "photos.location"])
            .andWhere('marathons_categories.category = :id', { id: dto.category })
            .skip(skip)
            .take(10)
            .getMany();
    }

    private async getUserCategories(id: number) {
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

    async findByUserCategories(user_id: number, skip: number) {
        const categories = await this.getUserCategories(user_id);
        const tags = await this.getUserTagsByType(user_id, "language");

        if (categories.length > 0) {
            return await Marathon.getRepository()
                .createQueryBuilder('marathons')
                .leftJoinAndSelect('marathons.categories', 'marathons_categories')
                .leftJoinAndSelect('marathons.tags', 'marathons_tags')
                .leftJoinAndSelect('marathons.preview_photo', 'photos')
                .leftJoin('marathons.participants', 'users')
                .loadRelationCountAndMap("marathons.participants_quantity", "marathons.participants", "users")
                .loadRelationCountAndMap("marathons.stages_quantity", "marathons.stages", "marathons.marathons_stages")
                .select(["marathons", "photos.location"])
                .andWhere('marathons_categories.category IN (:...categories)', { categories })
                .andWhere('marathons_tags.tag IN (:...tags)', { tags })
                .skip(skip)
                .take(10)
                .getMany();
        }
        return []
    }

    async findByTag(dto: FindByTagDto, skip: number) {
        const tags = await this.tagService.findByName(dto);

        if (tags.length > 0) {

            const tagsIds: number[] = [];

            for (const tag of tags) {
                tagsIds.push(tag.tags_id);
            }

            return await Marathon.getRepository()
                .createQueryBuilder('marathons')
                .leftJoinAndSelect('marathons.tags', 'marathons_tags')
                .leftJoinAndSelect('marathons.preview_photo', 'photos')
                .leftJoin('marathons.participants', 'users')
                .loadRelationCountAndMap("marathons.participants_quantity", "marathons.participants", "users")
                .loadRelationCountAndMap("marathons.stages_quantity", "marathons.stages", "marathons.marathons_stages")
                .select(["marathons", "photos.location"])
                .andWhere('marathons_tags.tag IN (:...tags)', { tags: tagsIds })
                .skip(skip)
                .take(10)
                .getMany();
        }
        return []
    }

    async checkAuthor(user_id, id) {
        const user = user_id;
        const marathon = await Marathon.getRepository()
            .createQueryBuilder("marathons")
            .select("marathons")
            .where("marathons.author = :user_id", { user_id: user })
            .andWhere("marathons.id = :id", { id: id })
            .getOne();

        if (marathon) {
            return true;
        }
        return false
    }
}
