import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { User } from './models/user.entity';

@Resolver(() => User)
export class UserResolver {
  @ResolveField(() => String)
  token(@Parent() user: User, @ActiveUser() activeUser: User) {
    // return token only to current user
    return user?.id === activeUser?.id ? user?.token : null;
  }
}
