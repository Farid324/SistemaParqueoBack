import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { EmailModule } from './infrastructure/email/email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  exports: [PrismaModule, EmailModule],
})
export class SharedModule {}
