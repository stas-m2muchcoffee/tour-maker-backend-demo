import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';
import { RoleGuard } from './shared/guards/role.guard';
import { UserContextInterceptor } from './shared/interceptors/user-context.interceptor';
import { BadRequestException } from '@nestjs/common';
import { CustomValidationPipe } from './shared/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  const sharedModule = app.select(SharedModule);

  app.useGlobalGuards(sharedModule.get(RoleGuard));

  app.useGlobalInterceptors(sharedModule.get(UserContextInterceptor));

  app.useGlobalPipes(
    new CustomValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(errors, 'Validation Error'),
    }),
  );

  useContainer(app.select(AppModule), {
    fallback: true,
    fallbackOnErrors: true,
  });

  await app.listen(config.get<number>('PORT')!);
}
void bootstrap();
