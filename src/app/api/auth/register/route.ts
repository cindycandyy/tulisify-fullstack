import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Register API endpoint is working",
    method: "GET",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  console.log("📝 Registration attempt received")

  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email dan password harus diisi",
          success: false,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Format email tidak valid",
          success: false,
        },
        { status: 400 },
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password minimal 8 karakter",
          success: false,
        },
        { status: 400 },
      )
    }

    // TODO: Replace with real database operations
    // In production, this would be:
    // const existingUser = await getUserByEmail(email)
    // if (existingUser) return error
    // const hashedPassword = await bcrypt.hash(password, 12)
    // const newUser = await createUser({ name, email, hashedPassword })

    console.log("🔍 Creating user:", email)

    // Mock user creation - replace with real logic
    const newUser = {
      id: "user_" + Date.now(),
      name: name || email.split("@")[0],
      email: email,
      role: "USER",
      createdAt: new Date().toISOString(),
    }

    console.log("✅ Registration successful for:", email)

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("❌ Registration error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        success: false,
      },
      { status: 500 },
    )
  }
}
