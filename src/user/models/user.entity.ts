import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import type { UUID } from 'crypto';
import { BasicEntity } from '../../shared/entities/basic.entity';
import { UserRole } from '../../shared/enums/user-role.enum';

@Entity()
@ObjectType({ description: 'User' })
export class User extends BasicEntity {
  @Field(() => ID)
  declare readonly id: UUID;

  @Field()
  @Column({ unique: true })
  readonly email: string;

  @Column()
  readonly password: string;

  @Field(() => UserRole)
  @Column('enum', {
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Field(() => [String], { nullable: true })
  @Column('text', {
    array: true,
    nullable: true,
  })
  preferences?: string[];

  @Column({
    type: 'vector',
    nullable: true,
  })
  embedding?: string;
}
