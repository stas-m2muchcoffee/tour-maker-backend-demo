import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './models/tour.entity';
import { TourService } from './tour.service';
import { TourMutationResolver } from './tour.mutation.resolver';
import { TourQueryResolver } from './tour.query.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  providers: [TourService, TourMutationResolver, TourQueryResolver],
  exports: [TourService],
})
export class TourModule {}
