import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import type { UUID } from 'crypto';
import GraphQLJSON from 'graphql-type-json';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { TourStop } from '../../tour-stop/models/tour-stop.entity';
import { City } from '../../city/models/city.entity';
import { Category } from '../../category/models/category.entity';
import { User } from '../../user/models/user.entity';

@Entity()
@ObjectType({ description: 'Tour' })
export class Tour extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => GraphQLJSON)
  @Column({ type: 'json' })
  route: Record<string, any>;

  @Field(() => [TourStop], { nullable: true })
  @OneToMany(() => TourStop, (tourStop) => tourStop.tour, {
    cascade: true,
    lazy: true,
  })
  tourStops?: Relation<TourStop[]>;

  @Field(() => City)
  @ManyToOne(() => City, { lazy: true })
  city: Relation<City>;

  @Field(() => [Category])
  @ManyToMany(() => Category, { lazy: true })
  @JoinTable()
  categories: Relation<Category[]>;

  @Field(() => User)
  @ManyToOne(() => User, { lazy: true, onDelete: 'CASCADE' })
  user: Relation<User>;
}
