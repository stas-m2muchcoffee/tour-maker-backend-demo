import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './models/city.entity';
import { CityService } from './city.service';
import { CityQueryResolver } from './city.query.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  providers: [CityService, CityQueryResolver],
  exports: [CityService],
})
export class CityModule {}
