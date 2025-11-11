import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tour } from './models/tour.entity';
import { TourService } from './tour.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tour])],
  providers: [TourService],
  exports: [TourService],
})
export class TourModule {}
