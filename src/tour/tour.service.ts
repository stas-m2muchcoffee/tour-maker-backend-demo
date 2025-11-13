import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { map, keyBy, merge, filter } from 'lodash';
import * as z from 'zod';

import { BasicService } from '../shared/services/basic.service';
import { Tour } from './models/tour.entity';
import { CreateTourInput } from './dto/create-tour.input';
import { User } from '../user/models/user.entity';
import { CityService } from '../city/city.service';
import { CategoryService } from '../category/category.service';
import { OpenrouteService } from '../shared/services/openroute.service';
import { OverpassService } from '../shared/services/overpass.service';
import { GeminiService } from '../shared/services/gemini.service';
import { OverpassPoi } from '../../types/types';
import { GEMINI_DATA } from '../shared/constants/gemini-data';

@Injectable()
export class TourService extends BasicService<Tour> {
  constructor(
    @InjectRepository(Tour) protected repository: Repository<Tour>,
    private readonly cityService: CityService,
    private readonly categoryService: CategoryService,
    private readonly overpassService: OverpassService,
    private readonly openrouteService: OpenrouteService,
    private readonly geminiService: GeminiService,
  ) {
    super(repository);
  }

  async createTour(input: CreateTourInput, user: User) {
    const city = await this.cityService.findOneBy({ id: input.cityId });
    const categories = await this.categoryService.findBy({
      id: In(input.categoryIds),
    });

    const overpassPois = await this.overpassService.getPois(categories, city!);

    const geminiPrompt = GEMINI_DATA.selectPois.prompt(
      city!,
      categories,
      map(overpassPois, (poi) => ({
        id: poi.id,
        lon: poi.lon,
        lat: poi.lat,
        name: poi.tags.name,
      })),
    );
    const responseSchema = GEMINI_DATA.selectPois.responseSchema;
    const geminiPois = await this.geminiService.generateContent<
      z.infer<typeof responseSchema>
    >(geminiPrompt, responseSchema, 'gemini-2.5-flash-lite');

    if (!geminiPois?.pois?.length) {
      throw new Error('Failed to generate tour route. No selected POIs by AI.');
    }

    const poisById = keyBy(overpassPois, (poi) => String(poi.id));
    const pois = filter(
      map(geminiPois.pois, (geminiPoi) => {
        const poi = poisById[String(geminiPoi.id)];
        return poi ? merge({}, poi, geminiPoi) : null;
      }),
      Boolean,
    ) as (OverpassPoi & { nameEn: string })[];

    if ((pois?.length || 0) < 3) {
      throw new Error('Failed to generate tour route. Less than 53 stops');
    }

    const route = await this.openrouteService.getRouteGeoJson(
      'foot-walking',
      map(pois, (poi) => [poi.lon, poi.lat]),
    );

    // TODO: use AI to generate tour title and description
    return this.create({
      city: city!,
      categories,
      user,
      title: 'Your tour',
      description: 'Your tour description',
      route,
      tourStops: map(pois, (poi) => ({
        name: poi.nameEn,
        location: {
          latitude: poi.lat,
          longitude: poi.lon,
        },
      })),
    });
  }
}
