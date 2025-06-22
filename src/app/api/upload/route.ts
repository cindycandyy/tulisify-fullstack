import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // 'cover' or 'pdf'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${type}s/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("book-assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })    

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("book-assets").getPublicUrl(filePath)    

    return NextResponse.json({ url: publicUrl, path: filePath })
  } catch (error) {
    console.error("Error in POST /api/upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
