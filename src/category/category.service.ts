import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './models/category.entity';
import { BasicService } from '../shared/services/basic.service';

@Injectable()
export class CategoryService extends BasicService<Category> {
  constructor(
    @InjectRepository(Category) protected repository: Repository<Category>,
  ) {
    super(repository);
  }
}
