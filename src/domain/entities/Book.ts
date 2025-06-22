export interface Book {
  readonly id: string
  readonly title: string
  readonly author: string
  readonly year: number
  readonly category: BookCategory
  readonly cover: string
  readonly file: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type BookCategory = "SU" | "13+" | "18+"

export interface CreateBookRequest {
  title: string
  author: string
  year: number
  category: BookCategory
  cover: File | string
  file: File | string
}

export interface UpdateBookRequest {
  id: string
  title?: string
  author?: string
  year?: number
  category?: BookCategory
  cover?: File | string
  file?: File | string
}

export interface BookFilters {
  search?: string
  category?: BookCategory | "all"
  year?: number
  author?: string
}
