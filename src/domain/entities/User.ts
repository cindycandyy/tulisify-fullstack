export interface User {
  readonly id: string
  readonly email: string
  readonly role: UserRole
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type UserRole = "admin" | "user"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
