import {
  Args,
  Context,
  Mutation,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { AuthMutation } from './models/auth.mutation.model';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { User } from '../user/models/user.entity';
import { ActiveUser } from '../shared/decorators/active-user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import type { RequestWithUser } from '../../types/types';

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
  async signUp(
    @Args('input') input: SignUpInput,
    @Context('req') req: RequestWithUser,
  ) {
    const user = await this.authService.signUp(input);
    req.user = user;
    return user;
  }

  @ResolveField(() => User, {
    description: 'Authenticates an existing user',
  })
  async signIn(
    @Args('input') input: SignInInput,
    @Context('req') req: RequestWithUser,
  ) {
    const user = await this.authService.signIn(input);
    req.user = user;
    return user;
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
