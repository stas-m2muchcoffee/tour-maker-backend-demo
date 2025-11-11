import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './models/city.entity';
import { BasicService } from '../shared/services/basic.service';

@Injectable()
export class CityService extends BasicService<City> {
  constructor(@InjectRepository(City) protected repository: Repository<City>) {
    super(repository);
  }
}
