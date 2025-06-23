import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "../../../lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== API /books GET request started ===")

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    // Build query
    let query = supabaseServer.from("books").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,category.ilike.%${search}%`)
    }

    const { data: books, error } = await query

    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch books",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log(`Successfully fetched ${books?.length || 0} books`)
    return NextResponse.json({
      books: books || [],
      count: books?.length || 0,
      success: true,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, year, category, description, cover_url, pdf_url } = body

    console.log("Creating book with data:", { title, author, year, category, cover_url, pdf_url })

    if (!title || !author || !year || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: book, error } = await supabaseServer
      .from("books")
      .insert([
        {
          title,
          author,
          year: Number.parseInt(year.toString()),
          category,
          description: description || null,
          cover_url: cover_url || null,
          pdf_url: pdf_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json(
        {
          error: "Failed to create book",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("Book created successfully:", book)
    return NextResponse.json({ book }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/books:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
