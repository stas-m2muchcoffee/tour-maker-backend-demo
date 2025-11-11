import { Global, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { RoleGuard } from './guards/role.guard';
import { UserContextInterceptor } from './interceptors/user-context.interceptor';
import { AuthModule } from '../auth/auth.module';
import { ShouldExistValidator } from './validators/should-exist-validator';
import { MatchPasswordValidator } from './validators/match-password-validator';
import { CategoryModule } from '../category/category.module';
import { TourModule } from '../tour/tour.module';
import { TourStopModule } from '../tour-stop/tour-stop.module';
import { CityModule } from '../city/city.module';

const modules = [
  AuthModule,
  UserModule,
  CityModule,
  CategoryModule,
  TourModule,
  TourStopModule,
];

const services = [];

const guards = [RoleGuard];

const interceptors = [UserContextInterceptor];

const providers = [ShouldExistValidator, MatchPasswordValidator];

@Global()
@Module({
  imports: [...modules],
  providers: [...guards, ...interceptors, ...providers, ...services],
  exports: [...modules, ...providers, ...services],
})
export class SharedModule {}
