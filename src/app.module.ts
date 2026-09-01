import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { ParkingMapModule } from './modules/parking-map/parking-map.module';

@Module({
  imports: [SharedModule, AuthModule, UsersModule, HealthModule, ParkingMapModule],
})
export class AppModule {}
