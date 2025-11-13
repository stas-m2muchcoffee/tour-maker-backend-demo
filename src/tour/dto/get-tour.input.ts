import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import type { UUID } from 'crypto';

import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { TourService } from '../tour.service';

@InputType()
export class GetTourInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: TourService,
    }),
  )
  id: UUID;
}
