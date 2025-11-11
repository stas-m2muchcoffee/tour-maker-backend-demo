import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from '../shared/services/basic.service';
import { TourStop } from './models/tour-stop.entity';

@Injectable()
export class TourStopService extends BasicService<TourStop> {
  constructor(
    @InjectRepository(TourStop) protected repository: Repository<TourStop>,
  ) {
    super(repository);
  }
}
