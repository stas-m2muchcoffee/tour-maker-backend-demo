import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';

import { UserMutation } from './models/user.mutation.model';
import { UserService } from './user.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from './models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { UpdateUserPreferencesInput } from './dto/update-user-preferences.input';

@Resolver(() => UserMutation)
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserMutation)
  user() {
    return {};
  }

  @ResolveField(() => User, {
    description: 'Update preferences for the current user',
  })
  @Roles()
  updateMyPreferences(
    @Args('input') input: UpdateUserPreferencesInput,
    @ActiveUser() user: User,
  ) {
    return this.userService.updatePreferences(user, input.preferences);
  }
}
