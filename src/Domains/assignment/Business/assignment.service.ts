import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Photo } from '../entities/photo.entity';
import { FileService, FileType } from '../../file/file.service';
import { CreatePostDto } from '../Presentation/dto/create-post.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Video } from '../entities/video.entity';
import { PhotoService } from '../../photo/photo.service';
import { UpdatePostDto } from '../Presentation/dto/update-post.dto';
import { CreateCommentDto } from '../Presentation/dto/create-comment.dto';
import { PostComment } from '../entities/comment.entity';
import { PostCommentReply } from '../entities/comment_reply.entity';
import { CreateLikeDto } from '../Presentation/dto/like-post.dto';
import { PostLike } from '../entities/post_like.entity';
import { PostDislike } from '../entities/post_dislike.entity';
import { Doc } from '../entities/doc.entity';
import { Album } from '../entities/album.entity';
import { AlbumPost } from '../entities/album_post.entity';
import { AddToAlbumDto } from '../Presentation/dto/add-to-album.dto';
import { CheckLikeDto } from '../Presentation/dto/check.like.dto';
import { FindPostDto } from '../Presentation/dto/find-post.dto';
import { Like } from 'typeorm';
import { AddCategoriesDto } from '../Presentation/dto/add-categories.dto';
import { PostCategory } from '../entities/post_category.entity';
import { Category } from '../entities/category.entity';
import { FindByCategoryDto } from '../Presentation/dto/find-by-category.dto';
import { UserCategory } from '../entities/user_category.entity';
import { FindByUserCategoriesDto } from '../Presentation/dto/find-by-user-categories.dto';
import { PostTag } from '../entities/post_tag.entity';
import { Tag } from '../entities/tag.entity';
import { AddTagsDto } from '../Presentation/dto/add-tags.dto';
import { UserTag } from '../entities/user_tag.entity';
import { FindByTagDto } from '../Presentation/dto/find-by-tag.dto';
import { TagService } from '../../tag/tag.service';
import { CommentLike } from '../entities/comment_like.entity';
import { CommentReplyLike } from '../entities/comment_reply_like.entity';

@Injectable()
export class PostService {

    constructor(
        private configService: ConfigService,
        private fileService: FileService,
        private photoService: PhotoService,
        private tagService: TagService
    ) { }

    private async uploadVideo(video_file) {
        const video = new Video();

        const filePath = await this.fileService.createFile(FileType.VIDEO, video_file);

        video.location = filePath;
        video.duration = 3;
        video.type = video_file.mimetype

        return video.save();
    }

    private async uploadDocument(document) {
        const doc = new Doc();

        const filePath = await this.fileService.createFile(FileType.DOCUMENT, document);

        doc.location = filePath;
        doc.name = document.originalname;
        doc.type = document.mimetype;

        return doc.save();
    }

    async create(dto: CreatePostDto, docs, author) {
        const post = new Post();

        post.author = await User.findOne({ where: { id: author } });
        post.name = dto.name;
        post.views = 0;
        post.description = dto.description;
        post.is_pro = dto.is_pro;
        post.is_course = dto.is_course;
        post.is_premium = dto.is_premium;
        post.preview_photo = await this.photoService.uploadPhotoForPreviewOrAvatar(preview);

        let post_videos: Video[] = [];
        let post_photos: Photo[] = [];
        let post_docs: Doc[] = [];

        for (const video of videos) {
            const saved_video = await this.uploadVideo(video)
            post_videos.push(saved_video);
        }

        for (const photo of photos) {
            const saved_photo = await this.photoService.uploadPhotoForManyToMany(photo)
            post_photos.push(saved_photo);
        }

        for (const doc of docs) {
            const saved_doc = await this.uploadDocument(doc)
            post_docs.push(saved_doc);
        }

        post.videos = post_videos;
        post.photos = post_photos;
        post.docs = post_docs;

        return post.save();
    }

    async addCategories(dto: AddCategoriesDto, id) {
        const categories: PostCategory[] = [];

        const post = await Post.findOne({ where: { id } });

        for (const category of dto.categories) {
            const savedCategory = await this.createCategory(category, post)
            categories.push(savedCategory);
        }

        return categories;
    }

    async createCategory(categoryData, post) {
        const category = new PostCategory();

        category.post = post;
        category.category = await Category.findOne({ where: { id: categoryData.category } });

        return category.save();
    }


    async createTag(tagData, post) {
        const tag = new PostTag();

        tag.post = post;
        tag.tag = await Tag.findOne({ where: { id: tagData.tag } });

        return tag.save();
    }

    async addTags(dto: AddTagsDto, id) {
        const tags: PostTag[] = [];

        const post = await Post.findOne({ where: { id } });

        for (const tag of dto.tags) {
            const savedTag = await this.createTag(tag, post)
            tags.push(savedTag);
        }

        return tags;
    }

    async getAllProVideoPosts(skip: number) {
        const posts = Post.getRepository()
        return posts.createQueryBuilder("posts")
            .innerJoinAndSelect('posts.preview_photo', 'photos')
            .leftJoinAndSelect('posts.videos', 'videos')
            .select(['posts', 'photos.location', 'videos'])
            .where('posts.is_pro = true')
            .skip(skip)
            .take(10)
            .getMany();
    }

    async getOneProVideoPost(id) {
        const beforeShowPost = await Post.findOne({ where: { id } });
        beforeShowPost.views = beforeShowPost.views + 1;
        await beforeShowPost.save();

        const post = Post.getRepository()
        return post.createQueryBuilder("posts")
            .leftJoinAndSelect('posts.author', 'users')
            .leftJoinAndSelect('posts.videos', 'videos')
            .leftJoinAndSelect('posts.docs', 'docs')
            .leftJoin('posts.comments', 'posts_comments')
            .leftJoin('posts.likes', 'posts_likes')
            .leftJoin('posts.dislikes', 'posts_dislikes')
            .loadRelationCountAndMap("posts.likes_quantity", "posts.likes", "posts_likes")
            .loadRelationCountAndMap("posts.dislikes_quantity", "posts.dislikes", "posts_dislikes")
            .loadRelationCountAndMap("posts.comments_quantity", "posts.comments", "comment")
            .select(['posts', 'videos', 'users', 'docs'])
            .where('posts.id = :id', { id })
            .andWhere('posts.is_pro = true')

            .getOne();
    }

    async getAllSimplePosts(skip: number) {
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
            .skip(skip)
            .take(10)
            .getMany();
    }

    async getOneSimplePost(id) {
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
            .where('posts.id = :id', { id })

            .getOne();
    }

    async update(dto: UpdatePostDto, id) {
        const post = Post.getRepository();
        const currentPostData = await post.findOne({
            where: { id }
        });

        return await post.save({
            ...currentPostData,
            ...dto
        })
    }

    async updatePreviewPhoto(preview, id) {
        const post = Post.getRepository();
        const currentPostData = await post.findOne({
            where: { id }
        });

        return await post.save({
            ...currentPostData,
            preview_photo: await this.photoService.uploadPhotoForPreviewOrAvatar(preview)
        })
    }

    async updateVideo(videos, id) {
        const post = Post.getRepository();
        const currentPostData = await post.findOne({
            where: { id }
        });

        let post_videos: Video[] = [];

        for (const video of videos) {
            const saved_video = await this.uploadVideo(video)
            post_videos.push(saved_video);
        }

        return await post.save({
            ...currentPostData,
            videos: post_videos
        })
    }

    async updatePhotos(photos, id) {
        const post = Post.getRepository();
        const currentPostData = await post.findOne({
            where: { id }
        });

        let post_photos: Photo[] = [];

        for (const photo of photos) {
            const saved_photo = await this.photoService.uploadPhotoForManyToMany(photo)
            post_photos.push(saved_photo);
        }

        return await post.save({
            ...currentPostData,
            photos: post_photos
        })
    }

    async updateDocs(docs, id) {
        const post = Post.getRepository();
        const currentPostData = await post.findOne({
            where: { id }
        });

        let post_docs: Doc[] = [];

        for (const doc of docs) {
            const saved_docs = await this.uploadDocument(doc)
            post_docs.push(saved_docs);
        }

        return await post.save({
            ...currentPostData,
            docs: post_docs
        })
    }

    async delete(id) {
        const post = Post.getRepository();
        return await post.createQueryBuilder()
            .delete()
            .from('posts')
            .where('id = :id', { id: id })
            .execute();
    }

    async deleteComment(id) {
        const comment = PostComment.getRepository();
        return await comment.createQueryBuilder()
            .delete()
            .from('posts_comments')
            .where('id = :id', { id: id })
            .execute();
    }

    async deleteCommentReply(id) {
        const comment = PostCommentReply.getRepository();
        return await comment.createQueryBuilder()
            .delete()
            .from('posts_comments_replies')
            .where('id = :id', { id: id })
            .execute();
    }

    async createComment(dto: CreateCommentDto, id) {
        const comment = new PostComment();
        comment.post = await Post.findOne({ where: { id: id } });
        comment.user = await User.findOne({ where: { id: dto.author } });
        comment.text = dto.text;

        return comment.save();
    }

    async createCommentReply(dto: CreateCommentDto, id) {
        const comment = new PostCommentReply();
        comment.comment = await PostComment.findOne({ where: { id: id } });
        comment.user = await User.findOne({ where: { id: dto.author } });
        comment.text = dto.text;

        return comment.save();
    }

    async getComments(id: number, skip: number) {
        const comments = PostComment.getRepository();

        return await comments.createQueryBuilder("posts_comments")
            .innerJoinAndSelect('posts_comments.user', 'users')
            .innerJoinAndSelect('users.avatar', 'photos')
            .loadRelationCountAndMap("posts_comments.replies_quantity", "posts_comments.replies", "post_comments_replies")
            .loadRelationCountAndMap("posts_comments.likes_quantity", "posts_comments.likes", "comments_likes")
            .select(['posts_comments', 'users.full_name', 'users.id', 'users.avatar', 'photos.location'])
            .where('posts_comments.post = :id', { id: id })
            .skip(skip)
            .take(4)
            .getMany();

    }

    async getCommentReplies(id: number, skip: number) {
        const answers = PostCommentReply.getRepository();
        return await answers.createQueryBuilder("posts_comments_answers")
            .innerJoinAndSelect('posts_comments_answers.user', 'users')
            .innerJoinAndSelect('users.avatar', 'photos')
            .select(['posts_comments_answers', 'users.full_name', 'users.id', 'users.avatar', 'photos.location'])
            .where('posts_comments_answers.comment = :id', { id: id })
            .skip(skip)
            .take(4)
            .getMany()
    }

    async likePost(user_id: number, id) {
        this.deletePostDislike(user_id, id)

        const like = new PostLike();
        like.user = await User.findOne({ where: { id: user_id } });
        like.post = await Post.findOne({ where: { id: id } });
        return like.save()
    }

    async dislikePost(user_id: number, id) {
        this.deletePostLike(user_id, id)

        const dislike = new PostDislike();
        dislike.user = await User.findOne({ where: { id: user_id } });
        dislike.post = await Post.findOne({ where: { id: id } });
        return dislike.save()
    }

    async likeComment(dto: CreateLikeDto, comment_id) {
        const like = new CommentLike();
        like.user = await User.findOne({ where: { id: dto.user } });
        like.comment = await PostComment.findOne({ where: { id: comment_id } });
        return like.save()
    }

    async likeCommentReply(user_id: number, comment_id) {
        const like = new CommentReplyLike();
        like.user = await User.findOne({ where: { id: user_id } });
        like.comment_reply = await PostCommentReply.findOne({ where: { id: comment_id } });
        return like.save()
    }

    async deletePostLike(user_id: number, id) {
        const like = PostLike.getRepository();
        return await like.createQueryBuilder()
            .delete()
            .from('posts_likes')
            .where('post = :id', { id: id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }


    async deleteCommentLike(user_id: number, comment_id) {
        const like = CommentLike.getRepository();
        return await like.createQueryBuilder()
            .delete()
            .from('comments_likes')
            .where('comment = :id', { id: comment_id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }

    async deleteCommentReplyLike(user_id: number, comment_id) {
        const like = CommentLike.getRepository();
        return await like.createQueryBuilder()
            .delete()
            .from('comments_replies_likes')
            .where('comment_reply = :id', { id: comment_id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }

    async deletePostDislike(user_id: number, id) {
        const like = PostDislike.getRepository();
        return await like.createQueryBuilder()
            .delete()
            .from('posts_dislikes')
            .where('post = :id', { id: id })
            .andWhere('user = :user_id', { user_id: user_id })
            .execute();
    }

    async dislikeComment(dto: CreateLikeDto, id) {
        const dislike = new PostDislike();
        dislike.user = await User.findOne({ where: { id: dto.user } });
        dislike.post = await Post.findOne({ where: { id: id } });
        return dislike.save()
    }

    async addToAlbum(dto: AddToAlbumDto, id) {
        const albumPost = new AlbumPost();

        albumPost.post = await Post.findOne({ where: { id: id } });
        albumPost.album = await Album.findOne({ where: { id: dto.album } });

        return albumPost.save();
    }

    async deleteFromAlbum(dto: AddToAlbumDto, id) {
        const albumPost = AlbumPost.getRepository();
        return await albumPost.createQueryBuilder()
            .delete()
            .from('albums_posts')
            .where('albums_posts.post = :id', { id: id })
            .andWhere('albums_posts.album = :album_id', { album_id: dto.album })
            .execute();
    }

    async checkUserLikeOnPost(user_id: number, id: number) {
        const like = await PostLike.getRepository()
            .createQueryBuilder("posts_likes")
            .select("posts_likes")
            .where("posts_likes.user = :id", { id: user_id })
            .andWhere("posts_likes.post = :post_id", { post_id: id })
            .getOne();

        if (like) {
            return true;
        }
        return false

    }

    async checkUserLikeOnComment(user_id: number, id: number) {
        const like = await CommentLike.getRepository()
            .createQueryBuilder("comments_likes")
            .select("comments_likes")
            .where("comments_likes.user = :id", { id: user_id })
            .andWhere("comments_likes.comment = :comment_id", { comment_id: id })
            .getOne();

        if (like) {
            return true;
        }
        return false
    }

    async checkUserLikeOnCommentReply(user_id: number, id: number) {
        const like = await CommentReplyLike.getRepository()
            .createQueryBuilder("comments_replies_likes")
            .select("comments_replies_likes")
            .where("comments_replies_likes.user = :id", { id: user_id })
            .andWhere("comments_replies_likes.comment_reply = :comment_reply_id", { comment_reply_id: id })
            .getOne();

        if (like) {
            return true;
        }
        return false
    }

    async checkUserDislikeOnPost(user_id: number, id: number) {
        const like = await PostDislike.getRepository()
            .createQueryBuilder("posts_dislikes")
            //.where("post = :id", { id })
            .select("posts_dislikes")
            .where("posts_dislikes.user = :id", { id: user_id })
            .andWhere("posts_dislikes.post = :post_id", { post_id: id })
            .getOne();

        if (like) {
            return true;
        }
        return false

    }

    async findByName(dto: FindPostDto): Promise<Post[]> {
        return await Post.find({
            where: { name: Like('%' + dto.name + '%') }
        })
    }

    async findSimpleByCategory(dto: FindByCategoryDto, skip: number): Promise<Post[]> {
        return await Post.getRepository()
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.categories', 'posts_categories')
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
            .where('posts.is_pro = false')
            .andWhere('posts_categories.category = :id', { id: dto.category })
            .skip(skip)
            .take(10)
            .getMany();
    }

    async findProVideoByCategory(dto: FindByCategoryDto, skip: number): Promise<Post[]> {
        return await Post.getRepository()
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.categories', 'posts_categories')
            .innerJoinAndSelect('posts.preview_photo', 'photos')
            .leftJoinAndSelect('posts.videos', 'videos')
            .select(['posts', 'photos.location', 'videos'])
            .where('posts.is_pro = true')
            .andWhere('posts_categories.category = :id', { id: dto.category })
            .orderBy('posts.views')
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

    async findSimpleByUserCategories(dto: FindByUserCategoriesDto, skip: number) {
        const categories = await this.getUserCategories(dto.user);
        const tags = await this.getUserTagsByType(dto.user, "language");

        if (categories.length > 0) {
            return await Post.getRepository()
                .createQueryBuilder('posts')
                .leftJoinAndSelect('posts.categories', 'posts_categories')
                .leftJoinAndSelect('posts.tags', 'posts_tags')
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
                .where('posts.is_pro = false')
                .andWhere("posts_categories.category IN (:...categories)", { categories: categories })
                .andWhere('posts_tags.tag IN (:...tags)', { tags: tags })
                .orderBy('posts.views')
                .skip(skip)
                .take(10)
                .getMany();
        }
        return [];
    }

    async findProVideoByUserCategories(dto: FindByUserCategoriesDto, skip: number) {
        const categories = await this.getUserCategories(dto.user);
        const tags = await this.getUserTagsByType(dto.user, "language");

        if (categories.length > 0) {
            return await Post.getRepository()
                .createQueryBuilder('posts')
                .leftJoinAndSelect('posts.categories', 'posts_categories')
                .leftJoinAndSelect('posts.tags', 'posts_tags')
                .innerJoinAndSelect('posts.preview_photo', 'photos')
                .leftJoinAndSelect('posts.videos', 'videos')
                .select(['posts', 'photos.location', 'videos'])
                .where('posts.is_pro = true')
                .andWhere('posts_categories.category IN (:...categories)', { categories })
                .andWhere('posts_tags.tag IN (:...tags)', { tags })
                .orderBy('posts.views')
                .skip(skip)
                .take(10)
                .getMany();
        }
        return [];
    }

    async findProVideoByTag(dto: FindByTagDto, skip: number) {
        const tags = await this.tagService.findByName(dto);

        if (tags.length > 0) {

            const tagsIds: number[] = [];

            for (const tag of tags) {
                tagsIds.push(tag.tags_id);
            }

            return await Post.getRepository()
                .createQueryBuilder('posts')
                .leftJoinAndSelect('posts.tags', 'posts_tags')
                .innerJoinAndSelect('posts.preview_photo', 'photos')
                .leftJoinAndSelect('posts.videos', 'videos')
                .select(['posts', 'photos.location', 'videos'])
                .where('posts.is_pro = true')
                .andWhere('posts_tags.tag IN (:...tags)', { tags: tagsIds })
                .orderBy('posts.views')
                .skip(skip)
                .take(10)
                .getMany();
        }
        return []
    }

    async findSimpleByTag(dto: FindByTagDto, skip: number) {
        const tags = await this.tagService.findByName(dto);

        if (tags.length > 0) {

            const tagsIds: number[] = [];

            for (const tag of tags) {
                tagsIds.push(tag.tags_id);
            }

            return await Post.getRepository()
                .createQueryBuilder('posts')
                .leftJoinAndSelect('posts.tags', 'posts_tags')
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
                .where('posts.is_pro = false')
                .andWhere('posts_tags.tag IN (:...tags)', { tags: tagsIds })
                .orderBy('posts.views')
                .skip(skip)
                .take(10)
                .getMany();
        }
        return []
    }

    async checkAuthor(user_id, id) {
        const user = user_id;
        const post = await Post.getRepository()
            .createQueryBuilder("posts")
            .select("posts")
            .where("posts.author = :user_id", { user_id: user })
            .andWhere("posts.id = :id", { id: id })
            .getOne();

        if (post) {
            return true;
        }
        return false

    }
}
