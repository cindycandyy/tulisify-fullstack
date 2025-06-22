import { NextResponse } from "next/server"

export async function GET() {
  console.log("✅ Simple test endpoint called")
  return NextResponse.json({
    message: "Simple test endpoint working!",
    timestamp: new Date().toISOString(),
  })
}
