import type { IAuthRepository } from "../../../domain/repositories/IAuthRepository"
import type { LoginRequest, AuthResponse } from "../../../domain/entities/User"
import { Result } from "../../../domain/entities/common/Result"

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(request: LoginRequest): Promise<Result<AuthResponse>> {
    try {
      // Validation
      const validationResult = this.validateRequest(request)
      if (validationResult.isFailure) {
        return Result.failure<AuthResponse>(validationResult.error)
      }

      const result = await this.authRepository.login(request)

      if (result.isFailure) {
        return Result.failure<AuthResponse>(result.error)
      }

      return Result.success(result.value)
    } catch (error) {
      return Result.failure<AuthResponse>("Login failed")
    }
  }

  private validateRequest(request: LoginRequest): Result<void> {
    if (!request.email.trim()) {
      return Result.failure("Email is required")
    }

    if (!this.isValidEmail(request.email)) {
      return Result.failure("Invalid email format")
    }

    if (!request.password.trim()) {
      return Result.failure("Password is required")
    }

    if (request.password.length < 8) {
      return Result.failure("Password must be at least 8 characters")
    }

    return Result.success(undefined)
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
