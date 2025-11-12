import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';

@Entity()
@ObjectType({ description: 'City' })
export class City extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  @Column()
  readonly name: string;

  @Field()
  @Column()
  readonly countryName: string;

  @Column()
  readonly overpassId: string;
}
