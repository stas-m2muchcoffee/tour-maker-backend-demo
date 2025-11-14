import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { join, map, uniqBy } from 'lodash';

import { OverpassPoi } from '../../../types/types';
import { Category } from '../../category/models/category.entity';
import { City } from '../../city/models/city.entity';

@Injectable()
export class OverpassService {
  private readonly overpassUrl = 'https://overpass-api.de/api/interpreter';

  constructor(private readonly httpService: HttpService) {}

  async getPois(
    categories: Category[],
    city: City,
    limit = 100,
  ): Promise<OverpassPoi[]> {
    const query = this.buildQueryToGetPois(categories, city, limit);

    const response = await firstValueFrom(
      this.httpService
        .post<{ elements: OverpassPoi[] }>(this.overpassUrl, query, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((e) => {
            console.error(e);
            throw new Error('Overpass API error. Please try again later.');
          }),
        ),
    );

    if (!response.data?.elements?.length) {
      console.error('No POIs found in Overpass API.');
      throw new Error("Can't find POIs in Overpass API.");
    }

    return uniqBy<OverpassPoi>(response.data?.elements, 'id');
  }

  private buildQueryToGetPois(
    categories: Category[],
    city: City,
    limit: number,
  ): string {
    return `
      [out:json][timeout:60];
      area(id:${city.overpassId})->.searchArea;
      (
        ${join(
          map(categories, (category) =>
            join(
              map(
                category.overpassCategories,
                (overpassCategory) =>
                  `node[${overpassCategory}](area.searchArea)["name"~"."];`,
              ),
              '\n',
            ),
          ),
          '\n',
        )}
      );
      out center ${limit};
    `;
  }
}
