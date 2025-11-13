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
import { GetTourInput } from './dto/get-tour.input';
import { GetToursFilterInput } from './dto/get-tours-filter.input';
import { PagingInput } from '../shared/inputs/paging.input';
import { getPagingQuery } from '../shared/utils/get-paging-query';

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

    const selectPoisPrompt = GEMINI_DATA.selectPois.prompt(
      city!,
      categories,
      map(overpassPois, (poi) => ({
        id: poi.id,
        lon: poi.lon,
        lat: poi.lat,
        name: poi.tags.name,
      })),
    );
    const selectPoisResponseSchema = GEMINI_DATA.selectPois.responseSchema;
    const geminiPois = await this.geminiService.generateContent<
      z.infer<typeof selectPoisResponseSchema>
    >(selectPoisPrompt, selectPoisResponseSchema, 'gemini-2.5-flash-lite');

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
    ) as (OverpassPoi &
      z.infer<typeof selectPoisResponseSchema>['pois'][number])[];

    if ((pois?.length || 0) < 3) {
      throw new Error('Failed to generate tour route. Less than 53 stops');
    }

    const route = await this.openrouteService.getRouteGeoJson(
      'foot-walking',
      map(pois, (poi) => [poi.lon, poi.lat]),
    );

    const generateTourTitleAndDescriptionPrompt =
      GEMINI_DATA.generateTourTitleAndDescription.prompt(
        city!,
        categories,
        map(overpassPois, (poi) => ({
          id: poi.id,
          lon: poi.lon,
          lat: poi.lat,
          name: poi.tags.name,
        })),
      );
    const generateTourTitleAndDescriptionResponseSchema =
      GEMINI_DATA.generateTourTitleAndDescription.responseSchema;
    const tourTitleAndDescription = await this.geminiService.generateContent<
      z.infer<typeof generateTourTitleAndDescriptionResponseSchema>
    >(
      generateTourTitleAndDescriptionPrompt,
      generateTourTitleAndDescriptionResponseSchema,
    );

    return this.create({
      city: city!,
      categories,
      user,
      title: tourTitleAndDescription.title,
      description: tourTitleAndDescription.description,
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

  async getTours(filter?: GetToursFilterInput, paging?: PagingInput) {
    const { skip, take } = getPagingQuery(paging);
    const [results, total] = await this.findAndCount({
      ...(filter?.userId ? { where: { user: { id: filter.userId } } } : {}),
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });

    return { results, total, ...paging };
  }

  getTour(input: GetTourInput) {
    return this.findOneBy(input);
  }
}
