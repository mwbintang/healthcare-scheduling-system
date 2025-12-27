import { Test, TestingModule } from '@nestjs/testing'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { AuthUser } from './entities/auth.entitiy'
import { TokenValidationResult } from './entities/token-validation.entity'
import { CustomerProfile } from './entities/customer-profile.entity'
import { DeleteResponse } from './entities/delete-response.entity'

describe('AuthResolver', () => {
  let resolver: AuthResolver
  let authService: jest.Mocked<AuthService>

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateToken: jest.fn(),
    updateEmail: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
    authService = module.get(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('should register user', async () => {
      const result: AuthUser = {
        token:"jwt-token",
        profile:{
          id: '1',
          name: 'Bintang',
          email: 'bintang@mail.com',
        }
      }

      authService.register.mockResolvedValue(result)

      const response = await resolver.register({
        name: 'Bintang',
        email: 'bintang@mail.com',
        password: 'password',
      })

      expect(authService.register).toHaveBeenCalledWith(
        'Bintang',
        'bintang@mail.com',
        'password',
      )
      // expect(response).toEqual(result.profile)
    })
  })

  describe('login', () => {
    it('should login user', async () => {
      const result: AuthUser = {
        token:"jwt-token",
        profile:{
          id: '1',
          name: 'Bintang',
          email: 'bintang@mail.com',
        }
      }

      authService.login.mockResolvedValue(result)

      const response = await resolver.login({
        email: 'bintang@mail.com',
        password: 'password',
      })

      expect(authService.login).toHaveBeenCalledWith(
        'bintang@mail.com',
        'password',
      )
      // expect(response).toEqual(result.profile)
    })
  })

  describe('validateToken', () => {
    it('should validate token', async () => {
      const result: TokenValidationResult = {
        email: "test@email.com",
        userId: '1',
      }

      authService.validateToken.mockResolvedValue(result)

      const response = await resolver.validateToken('jwt-token')

      expect(authService.validateToken).toHaveBeenCalledWith('jwt-token')
      expect(response).toEqual(result)
    })
  })

  describe('updateEmail', () => {
    it('should update email', async () => {
      const result: CustomerProfile = {
        id: '1',
        email: 'new@mail.com',
        name: 'Bintang',
      }

      authService.updateEmail.mockResolvedValue(result)

      const response = await resolver.updateEmail({
        id: '1',
        email: 'new@mail.com',
      })

      expect(authService.updateEmail).toHaveBeenCalledWith(
        '1',
        'new@mail.com',
      )
      expect(response).toEqual(result)
    })
  })

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const result: DeleteResponse = {
        success: true,
        message: 'User deleted',
      }

      authService.delete.mockResolvedValue(result)

      const response = await resolver.deleteUser('1')

      expect(authService.delete).toHaveBeenCalledWith('1')
      expect(response).toEqual(result)
    })
  })
})
