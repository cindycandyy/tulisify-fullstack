import type { Book, CreateBookRequest, UpdateBookRequest, BookFilters } from "../entities/Book"
import type { Result } from "../entities/common/Result"

export interface IBookRepository {
  findAll(filters?: BookFilters): Promise<Result<Book[]>>
  findById(id: string): Promise<Result<Book | null>>
  create(book: CreateBookRequest): Promise<Result<Book>>
  update(book: UpdateBookRequest): Promise<Result<Book>>
  delete(id: string): Promise<Result<void>>
  count(): Promise<Result<number>>
}
