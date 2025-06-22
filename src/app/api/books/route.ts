import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

// GET - Get all books with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || "all"
    const author = searchParams.get("author") || ""

    // TODO: Replace with real database query
    let books = [
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
      {
        id: 2,
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        year: 1980,
        category: "18+",
        cover: "/uploads/covers/bumi-manusia.jpg",
        file: "/uploads/books/bumi-manusia.pdf",
        description: "Novel sejarah tentang kehidupan di masa kolonial Belanda.",
        pages: 535,
        size: "3.2 MB",
        createdAt: "2024-01-16T14:20:00Z",
        updatedAt: "2024-01-16T14:20:00Z",
      },
      {
        id: 3,
        title: "Ayat-Ayat Cinta",
        author: "Habiburrahman El Shirazy",
        year: 2004,
        category: "13+",
        cover: "/uploads/covers/ayat-ayat-cinta.jpg",
        file: "/uploads/books/ayat-ayat-cinta.pdf",
        description: "Novel romantis islami tentang perjalanan cinta seorang mahasiswa.",
        pages: 416,
        size: "1.8 MB",
        createdAt: "2024-01-17T09:15:00Z",
        updatedAt: "2024-01-17T09:15:00Z",
      },
    ]

    // Apply filters
    if (search) {
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (category !== "all") {
      books = books.filter((book) => book.category === category)
    }

    if (author) {
      books = books.filter((book) => book.author.toLowerCase().includes(author.toLowerCase()))
    }

    return NextResponse.json({
      success: true,
      data: books,
      total: books.length,
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch books" }, { status: 500 })
  }
}

// POST - Create new book
export async function POST(request: NextRequest) {
  try {
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

    if (!["SU", "13+", "18+"].includes(category)) {
      return NextResponse.json({ success: false, error: "Invalid category" }, { status: 400 })
    }

    // Create upload directories
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    const coversDir = path.join(uploadsDir, "covers")
    const booksDir = path.join(uploadsDir, "books")

    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true })
    if (!existsSync(coversDir)) await mkdir(coversDir, { recursive: true })
    if (!existsSync(booksDir)) await mkdir(booksDir, { recursive: true })

    let coverPath = "/placeholder.svg?height=300&width=200"
    let filePath = ""

    // Handle cover upload
    if (coverFile && coverFile.size > 0) {
      const coverBytes = await coverFile.arrayBuffer()
      const coverBuffer = Buffer.from(coverBytes)
      const coverFileName = `${Date.now()}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const coverFilePath = path.join(coversDir, coverFileName)

      await writeFile(coverFilePath, coverBuffer)
      coverPath = `/uploads/covers/${coverFileName}`
    }

    // Handle book file upload
    if (bookFile && bookFile.size > 0) {
      if (!bookFile.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ success: false, error: "Book file must be PDF format" }, { status: 400 })
      }

      const bookBytes = await bookFile.arrayBuffer()
      const bookBuffer = Buffer.from(bookBytes)
      const bookFileName = `${Date.now()}-${bookFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const bookFilePath = path.join(booksDir, bookFileName)

      await writeFile(bookFilePath, bookBuffer)
      filePath = `/uploads/books/${bookFileName}`
    }

    // TODO: Save to database
    const newBook = {
      id: Date.now(), // Use proper ID generation in production
      title,
      author,
      year,
      category,
      description,
      cover: coverPath,
      file: filePath,
      pages: 0, // TODO: Extract from PDF
      size: bookFile ? `${(bookFile.size / 1024 / 1024).toFixed(1)} MB` : "0 MB",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("Book created:", newBook)

    return NextResponse.json({
      success: true,
      data: newBook,
      message: "Book created successfully",
    })
  } catch (error) {
    console.error("Error creating book:", error)
    return NextResponse.json({ success: false, error: "Failed to create book" }, { status: 500 })
  }
}
