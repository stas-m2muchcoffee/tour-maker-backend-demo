import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './models/category.entity';
import { CategoryService } from './category.service';
import { CategoryQueryResolver } from './category.query.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryQueryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
