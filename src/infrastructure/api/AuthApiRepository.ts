import type { IAuthRepository } from "../../domain/repositories/IAuthRepository"
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "../../domain/entities/User"
import { Result } from "../../domain/entities/common/Result"

export class AuthApiRepository implements IAuthRepository {
  private readonly baseUrl: string
  private readonly tokenKey = "tulisify_token"

  constructor(baseUrl = "http://localhost:4000/api") {
    this.baseUrl = baseUrl
  }

  async login(request: LoginRequest): Promise<Result<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.json()
        return Result.failure<AuthResponse>(error.msg || "Login failed")
      }

      const data = await response.json()
      const authResponse: AuthResponse = {
        user: this.mapToUser(data.user),
        token: data.token,
      }

      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem(this.tokenKey, data.token)
      }

      return Result.success(authResponse)
    } catch (error) {
      return Result.failure<AuthResponse>("Network error occurred")
    }
  }

  async register(request: RegisterRequest): Promise<Result<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const error = await response.json()
        return Result.failure<AuthResponse>(error.msg || "Registration failed")
      }

      const data = await response.json()
      const authResponse: AuthResponse = {
        user: this.mapToUser(data.user),
        token: data.token,
      }

      // Store token
      if (typeof window !== "undefined") {
        localStorage.setItem(this.tokenKey, data.token)
      }

      return Result.success(authResponse)
    } catch (error) {
      return Result.failure<AuthResponse>("Network error occurred")
    }
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(this.tokenKey) : null

      if (!token) {
        return Result.success(null)
      }

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        // Token expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem(this.tokenKey)
        }
        return Result.success(null)
      }

      if (!response.ok) {
        return Result.failure<User | null>("Failed to get current user")
      }

      const data = await response.json()
      return Result.success(this.mapToUser(data))
    } catch (error) {
      return Result.failure<User | null>("Network error occurred")
    }
  }

  async logout(): Promise<Result<void>> {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.tokenKey)
      }
      return Result.success(undefined)
    } catch (error) {
      return Result.failure<void>("Logout failed")
    }
  }

  private mapToUser(data: any): User {
    return {
      id: data.id.toString(),
      email: data.email,
      role: data.role || "user",
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    }
  }
}
