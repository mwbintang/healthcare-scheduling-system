import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { RepositoryModule } from '../repository/repository.module'

@Module({
  imports: [
    RepositoryModule, // 👈 clean dependency
    JwtModule.register({
      secret: process.env.JWT_SECRET || "",
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
