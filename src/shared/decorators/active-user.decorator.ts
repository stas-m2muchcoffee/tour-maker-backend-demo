import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../../user/models/user.entity';
import { ContextWithUser } from '../../../types/types';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const context = gqlExecutionContext.getContext<ContextWithUser>();
    return context.req?.user as User;
  },
);
