import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './models/tour.entity';
import { TourService } from './tour.service';
import { TourMutationResolver } from './tour.mutation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  providers: [TourService, TourMutationResolver],
  exports: [TourService],
})
export class TourModule {}
