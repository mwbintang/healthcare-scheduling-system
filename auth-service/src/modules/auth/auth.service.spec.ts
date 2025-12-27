import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { AuthService } from './auth.service'
import { AuthRepository } from '../../repository/postgres/auth.repository'
import { ScheduleProvider } from '../../provider/schedule/schedule.provider'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let authRepository: jest.Mocked<AuthRepository>
  let jwtService: jest.Mocked<JwtService>
  let scheduleProvider: jest.Mocked<ScheduleProvider>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            findByEmailandId: jest.fn(),
            findById: jest.fn(),
            updateEmailById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ScheduleProvider,
          useValue: {
            createUser: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    authRepository = module.get(AuthRepository)
    jwtService = module.get(JwtService)
    scheduleProvider = module.get(ScheduleProvider)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      authRepository.findByEmail.mockResolvedValue(null as any)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password')

      authRepository.createUser.mockResolvedValue({
        id: 'user-id',
        email: 'test@mail.com',
      } as any)

      scheduleProvider.createUser.mockResolvedValue({
        id: 'user-id',
        name: 'Test',
        email: 'test@mail.com',
      } as any)

      jwtService.sign.mockReturnValue('jwt-token')

      const result = await service.register('Test', 'test@mail.com', 'password')

      expect(result.token).toBe('jwt-token')
      expect(result.profile.email).toBe('test@mail.com')
    })

    it('should throw ConflictException if email already exists', async () => {
      authRepository.findByEmail.mockResolvedValue({ id: '1' } as any)

      await expect(
        service.register('Test', 'test@mail.com', 'password'),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      authRepository.findByEmail.mockResolvedValue({
        id: 'user-id',
        email: 'test@mail.com',
        password: 'hashed',
      } as any)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      scheduleProvider.findById.mockResolvedValue({
        id: 'user-id',
        email: 'test@mail.com',
      } as any)

      jwtService.sign.mockReturnValue('jwt-token')

      const result = await service.login('test@mail.com', 'password')

      expect(result.token).toBe('jwt-token')
      expect(result.profile.id).toBe('user-id')
    })

    it('should throw UnauthorizedException if user not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null)

      await expect(
        service.login('test@mail.com', 'password'),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password is invalid', async () => {
      authRepository.findByEmail.mockResolvedValue({
        id: 'user-id',
        password: 'hashed',
      } as any)

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(
        service.login('test@mail.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      jwtService.verify.mockReturnValue({
        sub: 'user-id',
        email: 'test@mail.com',
      })

      authRepository.findByEmailandId.mockResolvedValue({
        id: 'user-id',
        email: 'test@mail.com',
      } as any)

      const result = await service.validateToken('valid-token')

      expect(result.userId).toBe('user-id')
      expect(result.email).toBe('test@mail.com')
    })

    it('should throw UnauthorizedException if token invalid', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid')
      })

      await expect(
        service.validateToken('invalid-token'),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('updateEmail', () => {
    it('should update email successfully', async () => {
      authRepository.findById.mockResolvedValue({
        id: 'user-id',
        email: 'old@mail.com',
      } as any)

      authRepository.findByEmail.mockResolvedValue(null)
      authRepository.updateEmailById.mockResolvedValue({
        id: 'user-id',
        email: 'new@mail.com',
      } as any)

      const result = await service.updateEmail('user-id', 'new@mail.com')

      expect(result.email).toBe('new@mail.com')
    })

    it('should throw NotFoundException if user not found', async () => {
      authRepository.findById.mockResolvedValue(null)

      await expect(
        service.updateEmail('user-id', 'new@mail.com'),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if email already used', async () => {
      authRepository.findById.mockResolvedValue({
        id: 'user-id',
        email: 'old@mail.com',
      } as any)

      authRepository.findByEmail.mockResolvedValue({
        id: 'other-id',
      } as any)

      await expect(
        service.updateEmail('user-id', 'used@mail.com'),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('delete', () => {
    it('should delete user successfully', async () => {
      authRepository.delete.mockResolvedValue(true)

      const result = await service.delete('user-id')

      expect(result.success).toBe(true)
    })

    it('should throw NotFoundException if user not found', async () => {
      authRepository.delete.mockResolvedValue(false)

      await expect(
        service.delete('user-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})


