import { Module } from '@nestjs/common';
import { CategoryController } from '../Presentation/HTTP/category.controller';
import { CategoryService } from '../Business/category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
