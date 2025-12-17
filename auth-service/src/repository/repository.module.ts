import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthRepository } from './postgres/auth.repository'

@Module({
  imports: [PrismaModule],
  providers: [AuthRepository],
  exports: [AuthRepository],
})
export class RepositoryModule {}
