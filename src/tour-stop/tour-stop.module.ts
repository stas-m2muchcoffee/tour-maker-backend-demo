import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourStop } from './models/tour-stop.entity';
import { TourStopService } from './tour-stop.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourStop])],
  providers: [TourStopService],
  exports: [TourStopService],
})
export class TourStopModule {}
