"use client"

import { useState, useEffect } from "react"
import type { Book } from "../lib/supabase"

export function useBooks(searchQuery = "") {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = searchQuery ? `/api/books?search=${encodeURIComponent(searchQuery)}` : "/api/books"
      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText || "Failed to fetch books"}`)
      }

      const data = await response.json()
      setBooks(data.books || [])
    } catch (err) {
      console.error("Fetch books error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching books")
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const addBook = async (bookData: {
    title: string
    author: string
    year: number
    category: string
    description: string
    cover_url?: string
    pdf_url?: string
  }) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookData,
          year: Number(bookData.year), // ensure it's a number
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to add book")
      }

      await fetchBooks()
      return data.book
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to add book")
    }
  }

  const updateBook = async (
    id: number,
    bookData: {
      title: string
      author: string
      year: number
      category: string
      description: string
      cover_url?: string
      pdf_url?: string
    }
  ) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to update book")
      }

      await fetchBooks()
      return data.book
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update book")
    }
  }

  const deleteBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.details || data.error || "Failed to delete book")
      }

      await fetchBooks()
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete book")
    }
  }

  const uploadFile = async (file: File, type: "cover" | "pdf") => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Upload failed:", data)
        throw new Error(data.details || data.error || "Failed to upload file")
      }

      return data.url
    } catch (err) {
      console.error(`${type} upload error:`, err)
      throw new Error(err instanceof Error ? err.message : "Failed to upload file")
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [searchQuery])

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    uploadFile,
    refetch: fetchBooks,
  }
}
