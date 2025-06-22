import type { User, LoginRequest, RegisterRequest, AuthResponse } from "../entities/User"
import type { Result } from "../entities/common/Result"

export interface IAuthRepository {
  login(request: LoginRequest): Promise<Result<AuthResponse>>
  register(request: RegisterRequest): Promise<Result<AuthResponse>>
  getCurrentUser(): Promise<Result<User | null>>
  logout(): Promise<Result<void>>
}
