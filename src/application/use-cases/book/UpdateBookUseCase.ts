import type { IBookRepository } from "../../../domain/repositories/IBookRepository"
import type { Book, UpdateBookRequest } from "../../../domain/entities/Book"
import { Result } from "../../../domain/entities/common/Result"

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(request: UpdateBookRequest): Promise<Result<Book>> {
    try {
      // Check if book exists
      const existingBook = await this.bookRepository.findById(request.id)
      if (existingBook.isFailure) {
        return Result.failure<Book>(existingBook.error)
      }

      if (!existingBook.value) {
        return Result.failure<Book>("Book not found")
      }

      // Validation
      const validationResult = this.validateRequest(request)
      if (validationResult.isFailure) {
        return Result.failure<Book>(validationResult.error)
      }

      const result = await this.bookRepository.update(request)

      if (result.isFailure) {
        return Result.failure<Book>(result.error)
      }

      return Result.success(result.value)
    } catch (error) {
      return Result.failure<Book>("Failed to update book")
    }
  }

  private validateRequest(request: UpdateBookRequest): Result<void> {
    if (request.title !== undefined && !request.title.trim()) {
      return Result.failure("Title cannot be empty")
    }

    if (request.author !== undefined && !request.author.trim()) {
      return Result.failure("Author cannot be empty")
    }

    if (request.year !== undefined && (request.year < 1000 || request.year > new Date().getFullYear() + 1)) {
      return Result.failure("Invalid year")
    }

    if (request.category !== undefined && !["SU", "13+", "18+"].includes(request.category)) {
      return Result.failure("Invalid category")
    }

    return Result.success(undefined)
  }
}
