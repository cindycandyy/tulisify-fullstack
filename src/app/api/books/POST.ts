// app/api/books/POST.ts
import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, year, category, description, cover_url, pdf_url } = body

    if (!title || !author || !year || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: book, error } = await supabaseServer
      .from("books")
      .insert([
        {
          title,
          author,
          year: Number(year),
          category,
          description: description || null,
          cover_url: cover_url || null,
          pdf_url: pdf_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create book", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ book }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
