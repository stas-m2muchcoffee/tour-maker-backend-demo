import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../shared/services/basic.service';
import { Tour } from './models/tour.entity';

@Injectable()
export class TourService extends BasicService<Tour> {
  constructor(@InjectRepository(Tour) protected repository: Repository<Tour>) {
    super(repository);
  }
}
