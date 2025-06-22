export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _error?: string,
    private readonly _value?: T,
  ) {}

  public static success<T>(value: T): Result<T> {
    return new Result<T>(true, undefined, value)
  }

  public static failure<T>(error: string): Result<T> {
    return new Result<T>(false, error)
  }

  public get isSuccess(): boolean {
    return this._isSuccess
  }

  public get isFailure(): boolean {
    return !this._isSuccess
  }

  public get error(): string {
    if (this._isSuccess) {
      throw new Error("Cannot get error from successful result")
    }
    return this._error!
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get value from failed result")
    }
    return this._value!
  }
}
