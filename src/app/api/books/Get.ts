// app/api/books/GET.ts
import { type NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    console.log("=== API /books GET request started ===")
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = supabaseServer.from("books").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,category.ilike.%${search}%`)
    }

    const { data: books, error } = await query

    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json({ error: "Failed to fetch books", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      books: books || [],
      count: books?.length || 0,
      success: true,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
