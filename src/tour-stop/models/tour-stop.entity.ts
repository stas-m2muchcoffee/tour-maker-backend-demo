import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, type Relation } from 'typeorm';
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
  name: string;

  @Field(() => Location)
  @Column({ type: 'json' })
  location: Location;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Tour, (tour) => tour.tourStops, {
    onDelete: 'CASCADE',
  })
  tour: Relation<Tour>;
}
