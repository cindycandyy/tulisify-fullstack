import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  console.log("✅ GET /api/login called")

  return NextResponse.json(
    {
      message: "Login API endpoint is working",
      method: "GET",
      timestamp: new Date().toISOString(),
      status: "OK",
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

export async function POST(request: NextRequest) {
  console.log("🔐 Login attempt received")

  try {
    const body = await request.json()
    const { email, password } = body

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

    // TODO: Replace with real database authentication
    // For now, simulate authentication logic
    console.log("🔍 Authenticating user:", email)

    // Simulate database lookup
    // In production, this would be:
    // const user = await getUserByEmail(email)
    // const isValidPassword = await bcrypt.compare(password, user.hashedPassword)

    // Mock authentication - replace with real logic
    const mockUser = {
      id: "user_" + Date.now(),
      email: email,
      name: email.split("@")[0], // Extract name from email
      role: email.includes("admin") ? "ADMIN" : "USER",
    }

    console.log("✅ Login successful for:", email)

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: mockUser,
      token: "jwt_token_" + Date.now(), // TODO: Generate real JWT
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        success: false,
      },
      { status: 500 },
    )
  }
}
