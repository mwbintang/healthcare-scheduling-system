import { Query, Resolver } from '@nestjs/graphql'
import { InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Resolver()
export class GraphqlHealthResolver {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  @Query(() => String)
  async health() {
    try {
      // lightweight DB check
      await this.prisma.$queryRaw`SELECT 1`
      return 'Schedule service is healthy'
    } catch (error) {
      throw new InternalServerErrorException('Database unavailable')
    }
  }
}