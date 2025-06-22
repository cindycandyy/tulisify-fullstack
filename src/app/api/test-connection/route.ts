import { NextResponse } from "next/server"
import { supabaseServer } from "../../../lib/supabase-server"

export async function GET() {
  try {
    console.log("=== Testing database connection ===")
    console.log("Environment variables:")
    console.log("- NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...")
    console.log("- SUPABASE_SERVICE_ROLE_KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test basic connection
    console.log("Testing basic connection...")
    const { data, error, count } = await supabaseServer.from("books").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Database connection error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: error.message,
          hint: error.message.includes("relation")
            ? "The 'books' table doesn't exist. Run the setup-database.sql script in your Supabase SQL Editor."
            : "Check your Supabase credentials in .env.local",
        },
        { status: 500 },
      )
    }

    console.log("Connection successful, record count:", count)

    return NextResponse.json({
      success: true,
      message: `Database connection successful. Found ${count || 0} books.`,
      count: count || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Connection test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Connection test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        hint: "Check your environment variables and Supabase setup",
      },
      { status: 500 },
    )
  }
}
