import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
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
  readonly title: string;

  @Field()
  @Column({ type: 'text' })
  readonly description: string;

  @Field(() => GraphQLJSON)
  @Column({ type: 'json' })
  readonly route: Record<string, any>;

  @Column({ type: 'vector', nullable: true })
  readonly embedding?: string;

  @Field(() => [TourStop], { nullable: true })
  @OneToMany(() => TourStop, (tourStop) => tourStop.tour, {
    cascade: true,
    lazy: true,
  })
  readonly tourStops?: Relation<TourStop[]>;

  @Field(() => [ID])
  @RelationId('tourStops')
  readonly tourStopIds: UUID[];

  @Field(() => City)
  @ManyToOne(() => City, { lazy: true })
  readonly city: Relation<City | Promise<City>>;

  @Field(() => ID)
  @RelationId('city')
  readonly cityId: UUID;

  @Field(() => [Category])
  @ManyToMany(() => Category, { lazy: true })
  @JoinTable()
  readonly categories: Relation<Category[] | Promise<Category[]>>;

  @Field(() => [ID])
  @RelationId('categories')
  readonly categoryIds: UUID[];

  @ManyToOne(() => User, { lazy: true, onDelete: 'CASCADE' })
  readonly user: Relation<User | Promise<User>>;

  @Field(() => ID)
  @RelationId('user')
  readonly userId: UUID;
}
