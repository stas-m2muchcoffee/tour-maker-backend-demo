import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import { BasicService } from '../shared/services/basic.service';

@Injectable()
export class UserService extends BasicService<User> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super(repository);
  }
}
