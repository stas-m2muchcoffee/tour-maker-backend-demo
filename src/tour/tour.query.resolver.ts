import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TourQuery } from './models/tour.query.model';
import { Tour } from './models/tour.entity';
import { Roles } from '../shared/decorators/roles.decorator';
import { TourService } from './tour.service';
import { GetTourInput } from './dto/get-tour.input';
import { GetToursFilterInput } from './dto/get-tours-filter.input';
import { PagingInput } from '../shared/inputs/paging.input';
import { TourPagingResult } from './models/tour-paging-result';
import { User } from '../user/models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';

@Resolver(() => TourQuery)
export class TourQueryResolver {
  constructor(private readonly tourService: TourService) {}

  @Query(() => TourQuery)
  tour() {
    return {};
  }

  @ResolveField(() => TourPagingResult, {
    description: 'Get tours by filter and paging',
  })
  @Roles()
  getTours(
    @Args('filter', { nullable: true }) filter?: GetToursFilterInput,
    @Args('paging', { nullable: true }) paging?: PagingInput,
  ) {
    return this.tourService.getTours(filter, paging);
  }

  @ResolveField(() => Tour, {
    description: 'Get a tour by id for the current user',
  })
  @Roles()
  getTour(@Args('input') input: GetTourInput) {
    return this.tourService.getTour(input);
  }

  @ResolveField(() => [Tour], {
    description: `
      Get recommended tours (created by other users) for the current user.
      The tours are sorted by the similarity of the user's embedding to the tour's embedding.
      The similarity is calculated using the cosine similarity between the user's embedding and the tour's embedding
      and filtered by a minimum quality score.
    `,
  })
  @Roles()
  getRecommendedTours(@ActiveUser() user: User) {
    return this.tourService.getRecommendedTours(user);
  }
}
