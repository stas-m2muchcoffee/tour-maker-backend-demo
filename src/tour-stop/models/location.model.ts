import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Location coordinates' })
export class Location {
  @Field(() => Number)
  latitude: number;

  @Field(() => Number)
  longitude: number;
}
