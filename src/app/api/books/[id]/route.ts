import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// GET - Get single book
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Replace with real database query
    const books = [
      {
        id: 1,
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        year: 2005,
        category: "SU",
        cover: "/uploads/covers/laskar-pelangi.jpg",
        file: "/uploads/books/laskar-pelangi.pdf",
        description: "Novel tentang perjuangan anak-anak Belitung untuk mendapatkan pendidikan.",
        pages: 529,
        size: "2.1 MB",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
      },
    ]

    const book = books.find((b) => b.id === id)

    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch book" }, { status: 500 })
  }
}

// PUT - Update book
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()

    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const year = Number.parseInt(formData.get("year") as string)
    const category = formData.get("category") as string
    const description = (formData.get("description") as string) || ""
    const coverFile = formData.get("cover") as File
    const bookFile = formData.get("file") as File

    // Validation
    if (!title || !author || !year || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Get existing book from database
    let coverPath = "/placeholder.svg?height=300&width=200"
    let filePath = ""

    // Handle file uploads if provided
    if (coverFile && coverFile.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "covers")
      if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true })

      const coverBytes = await coverFile.arrayBuffer()
      const coverBuffer = Buffer.from(coverBytes)
      const coverFileName = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const coverFilePath = path.join(uploadsDir, coverFileName)

      await writeFile(coverFilePath, coverBuffer)
      coverPath = `/uploads/covers/${coverFileName}`
    }

    if (bookFile && bookFile.size > 0) {
      if (!bookFile.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ success: false, error: "Book file must be PDF format" }, { status: 400 })
      }

      const uploadsDir = path.join(process.cwd(), "public", "uploads", "books")
      if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true })

      const bookBytes = await bookFile.arrayBuffer()
      const bookBuffer = Buffer.from(bookBytes)
      const bookFileName = `${Date.now()}-${bookFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const bookFilePath = path.join(uploadsDir, bookFileName)

      await writeFile(bookFilePath, bookBuffer)
      filePath = `/uploads/books/${bookFileName}`
    }

    // TODO: Update in database
    const updatedBook = {
      id,
      title,
      author,
      year,
      category,
      description,
      cover: coverPath,
      file: filePath,
      pages: 0,
      size: bookFile ? `${(bookFile.size / 1024 / 1024).toFixed(1)} MB` : "0 MB",
      updatedAt: new Date().toISOString(),
    }

    console.log("Book updated:", updatedBook)

    return NextResponse.json({
      success: true,
      data: updatedBook,
      message: "Book updated successfully",
    })
  } catch (error) {
    console.error("Error updating book:", error)
    return NextResponse.json({ success: false, error: "Failed to update book" }, { status: 500 })
  }
}

// DELETE - Delete book
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Get book from database to get file paths
    // TODO: Delete files from filesystem
    // TODO: Delete from database

    console.log("Book deleted:", id)

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting book:", error)
    return NextResponse.json({ success: false, error: "Failed to delete book" }, { status: 500 })
  }
}
