import { Module } from "@nestjs/common";
import { AuthenticationProvider } from "./authentication/authentication.provider";

@Module({
  providers: [AuthenticationProvider],
  exports: [AuthenticationProvider],
})
export class ProviderModule {}
