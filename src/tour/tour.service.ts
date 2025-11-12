import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { BasicService } from '../shared/services/basic.service';
import { Tour } from './models/tour.entity';
import { CreateTourInput } from './dto/create-tour.input';
import { User } from '../user/models/user.entity';
import { CityService } from '../city/city.service';
import { CategoryService } from '../category/category.service';
import { OpenrouteService } from '../shared/services/openroute.service';
import { OverpassService } from '../shared/services/overpass.service';
import { map, take } from 'lodash';

@Injectable()
export class TourService extends BasicService<Tour> {
  constructor(
    @InjectRepository(Tour) protected repository: Repository<Tour>,
    private readonly cityService: CityService,
    private readonly categoryService: CategoryService,
    private readonly overpassService: OverpassService,
    private readonly openrouteService: OpenrouteService,
  ) {
    super(repository);
  }

  async createTour(input: CreateTourInput, user: User) {
    const city = await this.cityService.findOneBy({ id: input.cityId });
    const categories = await this.categoryService.findBy({
      id: In(input.categoryIds),
    });

    const pois = await this.overpassService.getPois(categories, city!);

    // TODO: use AI to generate tour stops
    const tourStops = take(pois, 10);

    const route = await this.openrouteService.getRouteGeoJson(
      'foot-walking',
      pois.map((poi) => [poi.lon, poi.lat]),
    );

    // TODO: use AI to generate tour title and description
    return this.create({
      city: city!,
      categories,
      user,
      title: 'Your tour',
      description: 'Your tour description',
      route,
      tourStops: map(tourStops, (stop) => ({
        name: stop.tags.name,
        location: {
          latitude: stop.lat,
          longitude: stop.lon,
        },
      })),
    });
  }
}
