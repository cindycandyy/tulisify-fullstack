import { BookApiRepository } from "../api/BookApiRepository"
import { AuthApiRepository } from "../api/AuthApiRepository"
import { GetBooksUseCase } from "../../application/use-cases/book/GetBooksUseCase"
import { CreateBookUseCase } from "../../application/use-cases/book/CreateBookUseCase"
import { UpdateBookUseCase } from "../../application/use-cases/book/UpdateBookUseCase"
import { DeleteBookUseCase } from "../../application/use-cases/book/DeleteBookUseCase"
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase"
import { RegisterUseCase } from "../../application/use-cases/auth/RegisterUseCase"

export class Container {
  private static instance: Container
  private readonly dependencies = new Map<string, any>()

  private constructor() {
    this.registerDependencies()
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  private registerDependencies(): void {
    // Repositories
    this.dependencies.set("IBookRepository", new BookApiRepository())
    this.dependencies.set("IAuthRepository", new AuthApiRepository())

    // Use Cases
    this.dependencies.set("GetBooksUseCase", new GetBooksUseCase(this.get("IBookRepository")))
    this.dependencies.set("CreateBookUseCase", new CreateBookUseCase(this.get("IBookRepository")))
    this.dependencies.set("UpdateBookUseCase", new UpdateBookUseCase(this.get("IBookRepository")))
    this.dependencies.set("DeleteBookUseCase", new DeleteBookUseCase(this.get("IBookRepository")))
    this.dependencies.set("LoginUseCase", new LoginUseCase(this.get("IAuthRepository")))
    this.dependencies.set("RegisterUseCase", new RegisterUseCase(this.get("IAuthRepository")))
  }

  public get<T>(key: string): T {
    const dependency = this.dependencies.get(key)
    if (!dependency) {
      throw new Error(`Dependency ${key} not found`)
    }
    return dependency
  }
}
