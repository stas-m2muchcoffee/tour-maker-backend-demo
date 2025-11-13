import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID, Validate } from 'class-validator';
import type { UUID } from 'crypto';

import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { UserService } from '../../user/user.service';

@InputType()
export class GetToursFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: UserService,
    }),
  )
  userId?: UUID;
}
