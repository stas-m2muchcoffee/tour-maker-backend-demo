import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'lodash';

import { User } from './models/user.entity';
import { BasicService } from '../shared/services/basic.service';
import { EmbeddingService } from '../shared/services/embedding.service';

@Injectable()
export class UserService extends BasicService<User> {
  constructor(
    @InjectRepository(User) protected repository: Repository<User>,
    private readonly embeddingService: EmbeddingService,
  ) {
    super(repository);
  }

  async updatePreferences(user: User, preferences: string[]) {
    const embedding = await this.embeddingService.createEmbedding(
      join(preferences, ', '),
    );
    user.preferences = preferences;
    user.embedding = embedding;
    return this.repository.save(user);
  }
}
