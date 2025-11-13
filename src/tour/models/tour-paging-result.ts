import { Field, ObjectType } from '@nestjs/graphql';

import { PagingResult } from '../../shared/models/paging-result.model';
import { Tour } from './tour.entity';

@ObjectType({ description: 'Tour paging result' })
export class TourPagingResult extends PagingResult<Tour> {
  @Field(() => [Tour])
  declare readonly results: Tour[];
}
