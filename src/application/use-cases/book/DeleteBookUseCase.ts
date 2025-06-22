import type { IBookRepository } from "../../../domain/repositories/IBookRepository"
import { Result } from "../../../domain/entities/common/Result"

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(id: string): Promise<Result<void>> {
    try {
      // Check if book exists
      const existingBook = await this.bookRepository.findById(id)
      if (existingBook.isFailure) {
        return Result.failure<void>(existingBook.error)
      }

      if (!existingBook.value) {
        return Result.failure<void>("Book not found")
      }

      const result = await this.bookRepository.delete(id)

      if (result.isFailure) {
        return Result.failure<void>(result.error)
      }

      return Result.success(undefined)
    } catch (error) {
      return Result.failure<void>("Failed to delete book")
    }
  }
}
