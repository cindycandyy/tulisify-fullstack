import type { IBookRepository } from "../../../domain/repositories/IBookRepository"
import type { Book, CreateBookRequest } from "../../../domain/entities/Book"
import { Result } from "../../../domain/entities/common/Result"

export class CreateBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(request: CreateBookRequest): Promise<Result<Book>> {
    try {
      // Validation
      const validationResult = this.validateRequest(request)
      if (validationResult.isFailure) {
        return Result.failure<Book>(validationResult.error)
      }

      const result = await this.bookRepository.create(request)

      if (result.isFailure) {
        return Result.failure<Book>(result.error)
      }

      return Result.success(result.value)
    } catch (error) {
      return Result.failure<Book>("Failed to create book")
    }
  }

  private validateRequest(request: CreateBookRequest): Result<void> {
    if (!request.title.trim()) {
      return Result.failure("Title is required")
    }

    if (!request.author.trim()) {
      return Result.failure("Author is required")
    }

    if (request.year < 1000 || request.year > new Date().getFullYear() + 1) {
      return Result.failure("Invalid year")
    }

    if (!["SU", "13+", "18+"].includes(request.category)) {
      return Result.failure("Invalid category")
    }

    return Result.success(undefined)
  }
}
