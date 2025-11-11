import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, type Relation } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { TourStop } from '../../tour-stop/models/tour-stop.entity';
import { City } from '../../city/models/city.entity';
import { Category } from '../../category/models/category.entity';

@Entity()
@ObjectType({ description: 'Tour' })
export class Tour extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field(() => City)
  @ManyToOne(() => City, { lazy: true })
  city: Relation<City>;

  @Field(() => Category)
  @ManyToOne(() => Category, { lazy: true })
  category: Relation<Category>;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => [TourStop], { nullable: true })
  @OneToMany(() => TourStop, (tourStop) => tourStop.tour, {
    cascade: true,
    lazy: true,
  })
  tourStops?: Relation<TourStop[]>;
}
