import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OpenrouteService {
  private apiUrl = 'https://api.openrouteservice.org';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getRouteGeoJson(
    profile = 'foot-walking',
    coordinates: [number, number][],
  ): Promise<JSON> {
    const response = await firstValueFrom(
      this.httpService
        .post<JSON>(
          `${this.apiUrl}/v2/directions/${profile}/geojson`,
          {
            coordinates,
            // set the maximum possible search radius
            radiuses: -1,
          },
          {
            headers: {
              Authorization: this.configService.get<string>(
                'OPENROUTE_SERVICE_API_KEY',
              ),
            },
          },
        )
        .pipe(
          catchError((e) => {
            console.error(e);
            throw new Error('Openroute API error');
          }),
        ),
    );

    return response.data;
  }
}
