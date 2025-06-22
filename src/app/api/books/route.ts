import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "../../../lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      author,
      year,
      category,
      description = null,
      cover_url = null,
      pdf_url = null,
    } = body

    console.log("Creating book with data:", {
      title,
      author,
      year,
      category,
      cover_url,
      pdf_url,
    })

    // Validasi input
    if (!title || !author || !year || !category) {
      return NextResponse.json(
        { error: "Missing required fields (title, author, year, category)" },
        { status: 400 },
      )
    }

    const numericYear = typeof year === "number" ? year : parseInt(year)
    if (isNaN(numericYear)) {
      return NextResponse.json({ error: "Invalid year format" }, { status: 400 })
    }

    const { data, error } = await supabaseServer
      .from("books")
      .insert([
        {
          title,
          author,
          year: numericYear,
          category,
          description,
          cover_url,
          pdf_url,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Insert failed:", error)
      return NextResponse.json(
        {
          error: "Failed to create book",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Book inserted:", data)
    return NextResponse.json({ book: data }, { status: 201 })
  } catch (err) {
    console.error("Exception in POST /api/books:", err)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
