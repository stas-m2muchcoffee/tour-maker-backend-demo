import { Args, Mutation, ResolveField, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthMutation } from './models/auth.mutation.model';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { User } from '../user/models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';

@Resolver(() => AuthMutation)
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthMutation)
  auth() {
    return {};
  }

  @ResolveField(() => User, {
    description: 'Registers a new user',
  })
  signUp(@Args('input') input: SignUpInput) {
    return this.authService.signUp(input);
  }

  @ResolveField(() => User, {
    description: 'Authenticates an existing user',
  })
  signIn(@Args('input') input: SignInInput) {
    return this.authService.signIn(input);
  }

  @ResolveField(() => Boolean, {
    description: 'Logs out the current user',
  })
  @Roles()
  async logOut(@ActiveUser() user: User) {
    await this.authService.logOut(user);
    return true;
  }
}
