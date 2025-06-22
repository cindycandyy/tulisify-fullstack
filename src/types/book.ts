export interface Book {
    id: string
    title: string
    author: string
    year: number
    category: 'SU' | 'THIRTEEN_PLUS' | 'EIGHTEEN_PLUS'
    description?: string
    cover?: string
    file?: string
    createdAt: Date
    updatedAt: Date
    createdBy: string
  }
  
  export interface CreateBookRequest {
    title: string
    author: string
    year: number
    category: 'SU' | 'THIRTEEN_PLUS' | 'EIGHTEEN_PLUS'
    description?: string
  }
  
  export interface UpdateBookRequest {
    title?: string
    author?: string
    year?: number
    category?: 'SU' | 'THIRTEEN_PLUS' | 'EIGHTEEN_PLUS'
    description?: string
  }
  