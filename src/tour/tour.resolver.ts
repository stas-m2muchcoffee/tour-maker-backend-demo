import { Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { UUID } from 'crypto';

import { Tour } from './models/tour.entity';
import { User } from '../user/models/user.entity';
import { TourCreatedPayload } from './models/tour-created.payload';
import { WsRequestWithUser } from '../../types/types';

@Resolver(() => Tour)
export class TourResolver {
  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  @Subscription(() => TourCreatedPayload, {
    resolve: (payload: TourCreatedPayload) => payload,
    filter: (
      { userId }: TourCreatedPayload & { userId: UUID },
      _,
      { req }: WsRequestWithUser,
    ) => userId === (req.extra?.user as User)?.id,
  })
  tourCreated() {
    return this.pubSub.asyncIterableIterator('tourCreated');
  }
}
