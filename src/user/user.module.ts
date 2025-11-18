import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UserQueryResolver } from './user.query.resolver';
import { UserService } from './user.service';
import { UserMutationResolver } from './user.mutation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserQueryResolver, UserMutationResolver],
  exports: [UserService],
})
export class UserModule {}
