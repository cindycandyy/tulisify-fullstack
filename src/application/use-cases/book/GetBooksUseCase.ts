import type { IBookRepository } from "../../../domain/repositories/IBookRepository"
import type { Book, BookFilters } from "../../../domain/entities/Book"
import { Result } from "../../../domain/entities/common/Result"

export class GetBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(filters?: BookFilters): Promise<Result<Book[]>> {
    try {
      const result = await this.bookRepository.findAll(filters)

      if (result.isFailure) {
        return Result.failure<Book[]>(result.error)
      }

      return Result.success(result.value)
    } catch (error) {
      return Result.failure<Book[]>("Failed to fetch books")
    }
  }
}
