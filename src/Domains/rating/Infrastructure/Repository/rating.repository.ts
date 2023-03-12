import { Injectable } from "@nestjs/common/decorators";
import { Rating } from "../Models/rating.entity";
import { RatingDto } from "../../Business/Dto/rating.dto";

@Injectable()
export class RatingRepository{

    private rating = Rating.getRepository();

    async create(creationDto: RatingDto) {
        return Rating.create({...creationDto}).save();
    }
}