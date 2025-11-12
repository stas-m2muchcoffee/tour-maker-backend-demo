import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID, Validate } from 'class-validator';
import type { UUID } from 'crypto';

import { ShouldExistValidator } from '../../shared/validators/should-exist-validator';
import { CityService } from '../../city/city.service';
import { CategoryService } from '../../category/category.service';

@InputType()
export class CreateTourInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: CityService,
    }),
  )
  cityId: UUID;

  @Field(() => [ID])
  @IsNotEmpty()
  @IsArray()
  @IsUUID(4, { each: true })
  @Validate(
    ShouldExistValidator,
    ShouldExistValidator.params({
      service: CategoryService,
      prop: 'id',
    }),
  )
  categoryIds: UUID[];
}
