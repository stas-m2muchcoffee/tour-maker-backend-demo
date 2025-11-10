import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserQuery } from './models/user.query.model';
import { User } from './models/user.entity';
import { Roles } from '../shared/decorators/roles.decorator';
import { ActiveUser } from '../shared/decorators/active-user.decorator';

@Resolver(() => UserQuery)
export class UserQueryResolver {
  constructor() {}

  @Query(() => UserQuery)
  user() {
    return {};
  }

  @ResolveField(() => User, {
    description: 'self instance',
  })
  @Roles()
  getMe(@ActiveUser() user: User) {
    return user;
  }
}
