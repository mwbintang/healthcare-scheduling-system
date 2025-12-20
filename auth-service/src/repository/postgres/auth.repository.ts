import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) { }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  createUser(email: string, hashedPassword: string) {
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })
  }

  updateEmailById(id: string, email: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  findByEmailandId(id: string, email: string) {
    return this.prisma.user.findFirst({
      where: { id, email },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.user.deleteMany({
      where: { id },
    });

    return result.count > 0;
  }
}
