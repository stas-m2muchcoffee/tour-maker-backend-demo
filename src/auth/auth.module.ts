import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthMutationResolver } from './auth.mutation.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthMutationResolver],
  exports: [AuthService],
})
export class AuthModule {}
