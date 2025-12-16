import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthRepository } from '../repository/auth.repository'

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        // 1. Check if user exists
        const existingUser = await this.authRepository.findByEmail(email)
        if (existingUser) {
            throw new ConflictException('Email already registered')
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // 3. Create user
        const user = await this.authRepository.createUser(
            email,
            hashedPassword,
        )

        // 4. Sign JWT
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
            },
            {
                expiresIn: '1h', // reasonable expiry
            },
        )

        // 5. Return token
        return { token }
    }

    async login(email: string, password: string) {
        const user = await this.authRepository.findByEmail(email)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return {
            token: this.jwtService.sign(
                { sub: user.id, email: user.email },
                { expiresIn: '1h' },
            ),
        }
    }

    validateToken(token: string) {
        try {
            const { sub: userId, email } = this.jwtService.verify(token)

            return {
                userId,
                email,
            }
        } catch {
            throw new UnauthorizedException('Invalid token')
        }
    }
}
