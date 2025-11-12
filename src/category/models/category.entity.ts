import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import type { UUID } from 'crypto';

import { BasicEntity } from '../../shared/entities/basic.entity';

@Entity()
@ObjectType({ description: 'Category' })
export class Category extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  @Column()
  readonly name: string;

  @Column({ type: 'text', array: true })
  readonly overpassCategories: string[];
}
