import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';

import { TourMutation } from './models/tour.mutation.model';
import { CreateTourInput } from './dto/create-tour.input';
import { User } from '../user/models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { TourService } from './tour.service';
import { Roles } from '../shared/decorators/roles.decorator';

@Resolver(() => TourMutation)
export class TourMutationResolver {
  constructor(private readonly tourService: TourService) {}

  @Mutation(() => TourMutation)
  tour() {
    return {};
  }

  @ResolveField(() => Boolean, {
    description:
      'Start a new tour creation process. Returns true once the job is started.',
  })
  @Roles()
  createTour(@Args('input') input: CreateTourInput, @ActiveUser() user: User) {
    void this.tourService.createTourInBackground(input, user);
    return true;
  }
}
