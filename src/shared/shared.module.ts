import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { EmailModule } from './infrastructure/email/email.module';
import { IHashingService } from './domain/services/hashing.service.interface';
import { BcryptHashingService } from './infrastructure/security/bcrypt-hashing.service';

@Global()
@Module({
  imports: [PrismaModule, EmailModule],
  providers: [
    {
      provide: IHashingService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [PrismaModule, EmailModule, IHashingService],
})
export class SharedModule {}
