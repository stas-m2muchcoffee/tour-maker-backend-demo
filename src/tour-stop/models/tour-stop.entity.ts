import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId, type Relation } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { Tour } from '../../tour/models/tour.entity';
import { Location } from './location.model';

@Entity()
@ObjectType({ description: 'Tour Stop' })
export class TourStop extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  @Column()
  readonly name: string;

  @Field(() => Location)
  @Column({ type: 'json' })
  readonly location: Location;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  readonly description?: string;

  @ManyToOne(() => Tour, (tour) => tour.tourStops, {
    onDelete: 'CASCADE',
  })
  readonly tour: Relation<Tour>;

  @Field(() => ID)
  @RelationId('tour')
  readonly tourId: UUID;
}
