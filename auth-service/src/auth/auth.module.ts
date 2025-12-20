import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { RepositoryModule } from '../repository/repository.module'
import { ProviderModule } from '../provider/provider.module'

@Module({
  imports: [
    RepositoryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "",
      signOptions: { expiresIn: '1h' },
    }),
    ProviderModule
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
