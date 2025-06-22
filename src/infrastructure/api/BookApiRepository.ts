import type { IBookRepository } from "../../domain/repositories/IBookRepository"
import type { Book, CreateBookRequest, UpdateBookRequest, BookFilters } from "../../domain/entities/Book"
import { Result } from "../../domain/entities/common/Result"

export class BookApiRepository implements IBookRepository {
  private readonly baseUrl: string

  constructor(baseUrl = "http://localhost:4000/api") {
    this.baseUrl = baseUrl
  }

  async findAll(filters?: BookFilters): Promise<Result<Book[]>> {
    try {
      const queryParams = new URLSearchParams()

      if (filters?.search) {
        queryParams.append("search", filters.search)
      }
      if (filters?.category && filters.category !== "all") {
        queryParams.append("category", filters.category)
      }
      if (filters?.year) {
        queryParams.append("year", filters.year.toString())
      }
      if (filters?.author) {
        queryParams.append("author", filters.author)
      }

      const url = `${this.baseUrl}/books${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
      const response = await fetch(url)

      if (!response.ok) {
        return Result.failure<Book[]>("Failed to fetch books")
      }

      const data = await response.json()
      return Result.success(data.map(this.mapToBook))
    } catch (error) {
      return Result.failure<Book[]>("Network error occurred")
    }
  }

  async findById(id: string): Promise<Result<Book | null>> {
    try {
      const response = await fetch(`${this.baseUrl}/books/${id}`)

      if (response.status === 404) {
        return Result.success(null)
      }

      if (!response.ok) {
        return Result.failure<Book | null>("Failed to fetch book")
      }

      const data = await response.json()
      return Result.success(this.mapToBook(data))
    } catch (error) {
      return Result.failure<Book | null>("Network error occurred")
    }
  }

  async create(book: CreateBookRequest): Promise<Result<Book>> {
    try {
      const formData = new FormData()
      formData.append("title", book.title)
      formData.append("author", book.author)
      formData.append("year", book.year.toString())
      formData.append("category", book.category)

      if (book.cover instanceof File) {
        formData.append("cover", book.cover)
      }
      if (book.file instanceof File) {
        formData.append("file", book.file)
      }

      const response = await fetch(`${this.baseUrl}/books`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        return Result.failure<Book>(error.message || "Failed to create book")
      }

      const data = await response.json()
      return Result.success(this.mapToBook(data))
    } catch (error) {
      return Result.failure<Book>("Network error occurred")
    }
  }

  async update(book: UpdateBookRequest): Promise<Result<Book>> {
    try {
      const formData = new FormData()
      formData.append("id", book.id)

      if (book.title !== undefined) {
        formData.append("title", book.title)
      }
      if (book.author !== undefined) {
        formData.append("author", book.author)
      }
      if (book.year !== undefined) {
        formData.append("year", book.year.toString())
      }
      if (book.category !== undefined) {
        formData.append("category", book.category)
      }
      if (book.cover instanceof File) {
        formData.append("cover", book.cover)
      }
      if (book.file instanceof File) {
        formData.append("file", book.file)
      }

      const response = await fetch(`${this.baseUrl}/books/${book.id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        return Result.failure<Book>(error.message || "Failed to update book")
      }

      const data = await response.json()
      return Result.success(this.mapToBook(data))
    } catch (error) {
      return Result.failure<Book>("Network error occurred")
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/books/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        return Result.failure<void>(error.message || "Failed to delete book")
      }

      return Result.success(undefined)
    } catch (error) {
      return Result.failure<void>("Network error occurred")
    }
  }

  async count(): Promise<Result<number>> {
    try {
      const response = await fetch(`${this.baseUrl}/books/count`)

      if (!response.ok) {
        return Result.failure<number>("Failed to get book count")
      }

      const data = await response.json()
      return Result.success(data.count)
    } catch (error) {
      return Result.failure<number>("Network error occurred")
    }
  }

  private mapToBook(data: any): Book {
    return {
      id: data.id.toString(),
      title: data.title,
      author: data.author,
      year: data.year,
      category: data.category,
      cover: data.cover,
      file: data.file,
      createdAt: new Date(data.created_at || Date.now()),
      updatedAt: new Date(data.updated_at || Date.now()),
    }
  }
}
