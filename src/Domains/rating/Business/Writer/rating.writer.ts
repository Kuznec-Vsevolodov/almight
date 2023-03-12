import { Injectable } from '@nestjs/common';
import { RatingDto } from '../Dto/rating.dto';
import { RatingRepository } from '../../Infrastructure/Repository/rating.repository';
import { CreateRatingDto } from '../../Presentation/Dto/create-rating.dto';
import { UserService } from 'src/Domains/user/Business/user.service';
import { ContractorService } from 'src/Domains/contractor/Business/contractor.service';

@Injectable()
export class RatingWriter {

    constructor(
        private ratingRepository: RatingRepository,
        private userService: UserService,
        private contractorService: ContractorService
    ) { }

    public async create(presentationDto: CreateRatingDto) {
        const rating = new RatingDto(); 

        rating.comment = presentationDto.comment;
        rating.value = presentationDto.value;
        rating.client = await this.userService.getById(presentationDto.client)
        rating.contractor = await this.contractorService.getById(presentationDto.contractor)

        return await this.ratingRepository.create(rating);
    }

}