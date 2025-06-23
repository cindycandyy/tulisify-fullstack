import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "../../../../lib/supabase-server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, author, year, category, description, cover_url, pdf_url } = body
    const bookId = Number.parseInt(params.id)

    if (!title || !author || !year || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: book, error } = await supabaseServer
      .from("books")
      .update({
        title,
        author,
        year: Number.parseInt(year.toString()),
        category,
        description: description || null,
        cover_url: cover_url || null,
        pdf_url: pdf_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId)
      .select()
      .single()

    if (error) {
      console.error("Error updating book:", error)
      return NextResponse.json({ error: "Failed to update book" }, { status: 500 })
    }

    return NextResponse.json({ book })
  } catch (error) {
    console.error("Error in PUT /api/books/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = Number.parseInt(params.id)

    const { error } = await supabaseServer.from("books").delete().eq("id", bookId)

    if (error) {
      console.error("Error deleting book:", error)
      return NextResponse.json({ error: "Failed to delete book" }, { status: 500 })
    }

    return NextResponse.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/books/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
