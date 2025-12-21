import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { AuthRepository } from '../../repository/postgres/auth.repository'
import { ScheduleProvider } from '../../provider/schedule/schedule.provider'
import { TokenValidationResult } from './entities/token-validation.entity'
import { AuthUser } from './entities/auth.entitiy'
import { CustomerProfile } from './entities/customer-profile.entity'
import { DeleteResponse } from './entities/delete-response.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService,
        private readonly scheduleProvider: ScheduleProvider
    ) { }

    async register(name: string, email: string, password: string): Promise<AuthUser> {
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

        const profile = await this.scheduleProvider.createUser({
            id: user.id,
            name,
            email
        });

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
        return {
            token,
            profile
        };
    }

    async login(email: string, password: string): Promise<AuthUser> {
        const user = await this.authRepository.findByEmail(email)

        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const profile = await this.scheduleProvider.findById(user.id);
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
            },
            { expiresIn: '1h' },
        );

        return {
            token,
            profile
        };
    }

    async validateToken(token: string): Promise<TokenValidationResult> {
        try {
            const { sub: userId, email } = this.jwtService.verify(token);

            const existing = await this.authRepository.findByEmailandId(userId, email);

            if (!existing) {
                throw new NotFoundException('User not found');
            };

            return {
                userId,
                email,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }

    async updateEmail(id: string, email: string): Promise<CustomerProfile> {
        const user = await this.authRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (email && email !== user.email) {
            const emailOwner = await this.authRepository.findByEmail(email);

            if (emailOwner && emailOwner.id !== id) {
                throw new ConflictException('Email already exists');
            }
        }

        return this.authRepository.updateEmailById(id, email);
    }

    async delete(id: string): Promise<DeleteResponse> {
        const deleted = await this.authRepository.delete(id);

        if (!deleted) {
            throw new NotFoundException('Customer not found');
        }

        return {
            success: deleted,
            message: `${deleted ? "Success" : "Failed"} delete customer`
        };
    }
}
