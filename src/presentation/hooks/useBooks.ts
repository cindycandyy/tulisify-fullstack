"use client"

import { useState, useEffect } from "react"
import type { Book, BookFilters } from "../../domain/entities/Book"
import type { GetBooksUseCase } from "../../application/use-cases/book/GetBooksUseCase"
import { Container } from "../../infrastructure/di/Container"

interface UseBooksState {
  books: Book[]
  loading: boolean
  error: string | null
}

export const useBooks = (filters?: BookFilters) => {
  const [state, setState] = useState<UseBooksState>({
    books: [],
    loading: true,
    error: null,
  })

  const getBooksUseCase = Container.getInstance().get<GetBooksUseCase>("GetBooksUseCase")

  const fetchBooks = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    const result = await getBooksUseCase.execute(filters)

    if (result.isSuccess) {
      setState({
        books: result.value,
        loading: false,
        error: null,
      })
    } else {
      setState({
        books: [],
        loading: false,
        error: result.error,
      })
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [filters?.search, filters?.category, filters?.year, filters?.author])

  return {
    ...state,
    refetch: fetchBooks,
  }
}
