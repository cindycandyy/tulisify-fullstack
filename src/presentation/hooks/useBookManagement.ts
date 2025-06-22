"use client"

import { useState } from "react"
import type { Book, CreateBookRequest, UpdateBookRequest } from "../../domain/entities/Book"
import type { CreateBookUseCase } from "../../application/use-cases/book/CreateBookUseCase"
import type { UpdateBookUseCase } from "../../application/use-cases/book/UpdateBookUseCase"
import type { DeleteBookUseCase } from "../../application/use-cases/book/DeleteBookUseCase"
import { Container } from "../../infrastructure/di/Container"

interface UseBookManagementState {
  loading: boolean
  error: string | null
}

export const useBookManagement = () => {
  const [state, setState] = useState<UseBookManagementState>({
    loading: false,
    error: null,
  })

  const createBookUseCase = Container.getInstance().get<CreateBookUseCase>("CreateBookUseCase")
  const updateBookUseCase = Container.getInstance().get<UpdateBookUseCase>("UpdateBookUseCase")
  const deleteBookUseCase = Container.getInstance().get<DeleteBookUseCase>("DeleteBookUseCase")

  const createBook = async (request: CreateBookRequest): Promise<Book | null> => {
    setState({ loading: true, error: null })

    const result = await createBookUseCase.execute(request)

    if (result.isSuccess) {
      setState({ loading: false, error: null })
      return result.value
    } else {
      setState({ loading: false, error: result.error })
      return null
    }
  }

  const updateBook = async (request: UpdateBookRequest): Promise<Book | null> => {
    setState({ loading: true, error: null })

    const result = await updateBookUseCase.execute(request)

    if (result.isSuccess) {
      setState({ loading: false, error: null })
      return result.value
    } else {
      setState({ loading: false, error: result.error })
      return null
    }
  }

  const deleteBook = async (id: string): Promise<boolean> => {
    setState({ loading: true, error: null })

    const result = await deleteBookUseCase.execute(id)

    if (result.isSuccess) {
      setState({ loading: false, error: null })
      return true
    } else {
      setState({ loading: false, error: result.error })
      return false
    }
  }

  return {
    ...state,
    createBook,
    updateBook,
    deleteBook,
  }
}
