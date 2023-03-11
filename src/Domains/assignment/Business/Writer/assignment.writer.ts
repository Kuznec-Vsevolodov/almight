import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Photo } from '../entities/photo.entity';
import { FileService, FileType } from '../../file/file.service';
import { CreateAssignmentDto } from '../../Presentation/dto/create-assignment.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { Video } from '../entities/video.entity';
import { PhotoService } from '../../photo/photo.service';
import { UpdatePostDto } from './Dto/update-post.dto';
import { CreateCommentDto } from './Dto/create-comment.dto';
import { PostComment } from '../entities/comment.entity';
import { PostCommentReply } from '../entities/comment_reply.entity';
import { CreateLikeDto } from './Dto/like-post.dto';
import { PostLike } from '../entities/post_like.entity';
import { PostDislike } from '../entities/post_dislike.entity';
import { Doc } from '../entities/doc.entity';
import { Album } from '../entities/album.entity';
import { AlbumPost } from '../entities/album_post.entity';
import { AddToAlbumDto } from './Dto/add-to-album.dto';
import { CheckLikeDto } from './Dto/check.like.dto';
import { FindPostDto } from './Dto/find-post.dto';
import { Like } from 'typeorm';
import { AddCategoriesDto } from './Dto/add-categories.dto';
import { PostCategory } from '../entities/post_category.entity';
import { Category } from '../entities/category.entity';
import { FindByCategoryDto } from './Dto/find-by-category.dto';
import { UserCategory } from '../entities/user_category.entity';
import { FindByUserCategoriesDto } from './Dto/find-by-user-categories.dto';
import { PostTag } from '../entities/post_tag.entity';
import { Tag } from '../entities/tag.entity';
import { AddTagsDto } from './Dto/add-tags.dto';
import { UserTag } from '../entities/user_tag.entity';
import { FindByTagDto } from './Dto/find-by-tag.dto';
import { TagService } from '../../tag/tag.service';
import { CommentLike } from '../entities/comment_like.entity';
import { CommentReplyLike } from '../entities/comment_reply_like.entity';
import { AssignmentDto } from '../Dto/assignment.dto';
import { Service } from 'src/entities/service.entity';

@Injectable()
export class AssignmentWriter {

    async create(presentationDto: CreateAssignmentDto, preview, videos, photos, docs) {
        const assignment = new AssignmentDto();

        assignment.client = await User.findOne({ where: { id: presentationDto.client } });
        assignment.contractor = await User.findOne({ where: { id: presentationDto.contractor } });
        assignment.service = await Service.findOne({where: { id: presentationDto.service }})
        assignment.description = presentationDto.description;
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

}