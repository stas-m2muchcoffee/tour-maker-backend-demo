import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CityQuery } from './models/city.query.model';
import { City } from './models/city.entity';
import { CityService } from './city.service';

@Resolver(() => CityQuery)
export class CityQueryResolver {
  constructor(private readonly cityService: CityService) {}

  @Query(() => CityQuery)
  city() {
    return {};
  }

  @ResolveField(() => [City], {
    description: 'Get all cities',
  })
  getCities() {
    return this.cityService.find();
  }
}
