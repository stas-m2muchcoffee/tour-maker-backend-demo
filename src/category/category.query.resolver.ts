import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoryQuery } from './models/category.query.model';
import { Category } from './models/category.entity';
import { CategoryService } from './category.service';

@Resolver(() => CategoryQuery)
export class CategoryQueryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => CategoryQuery)
  category() {
    return {};
  }

  @ResolveField(() => [Category], {
    description: 'Get all categories',
  })
  getCategories() {
    return this.categoryService.find();
  }
}
