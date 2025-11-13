import { Field, ObjectType } from '@nestjs/graphql';

import { Tour } from './tour.entity';

@ObjectType()
export class TourCreatedPayload {
  @Field(() => Tour, { nullable: true })
  tour?: Tour;

  @Field(() => String, { nullable: true })
  error?: string;
}
