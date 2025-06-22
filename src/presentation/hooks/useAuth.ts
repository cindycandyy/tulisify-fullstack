"use client"

import { useState, useEffect } from "react"
import type { User, LoginRequest, RegisterRequest } from "../../domain/entities/User"
import type { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase"
import type { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase"
import { Container } from "../../infrastructure/di/Container"
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository"

interface UseAuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuth = () => {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const loginUseCase = Container.getInstance().get<LoginUseCase>("LoginUseCase")
  const registerUseCase = Container.getInstance().get<RegisterUseCase>("RegisterUseCase")
  const authRepository = Container.getInstance().get<IAuthRepository>("IAuthRepository")

  const login = async (request: LoginRequest): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const result = await loginUseCase.execute(request)

    if (result.isSuccess) {
      setState({
        user: result.value.user,
        loading: false,
        error: null,
      })
      return true
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: result.error,
      }))
      return false
    }
  }

  const register = async (request: RegisterRequest): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const result = await registerUseCase.execute(request)

    if (result.isSuccess) {
      setState({
        user: result.value.user,
        loading: false,
        error: null,
      })
      return true
    } else {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: result.error,
      }))
      return false
    }
  }

  const logout = async (): Promise<void> => {
    await authRepository.logout()
    setState({
      user: null,
      loading: false,
      error: null,
    })
  }

  const checkAuth = async () => {
    setState((prev) => ({ ...prev, loading: true }))

    const result = await authRepository.getCurrentUser()

    if (result.isSuccess) {
      setState({
        user: result.value,
        loading: false,
        error: null,
      })
    } else {
      setState({
        user: null,
        loading: false,
        error: null,
      })
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  }
}
