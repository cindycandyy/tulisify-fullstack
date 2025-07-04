"use server"

export async function registerUser(formData: FormData) {
  console.log("🔥 Server Action: registerUser called")

  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("📥 Received data:", { name, email, password: "***" })

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: "Email dan password wajib diisi",
      }
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password minimal 8 karakter",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Format email tidak valid",
      }
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would typically:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send verification email

    console.log("✅ Registration successful for:", email)

    return {
      success: true,
      message: "Akun berhasil didaftarkan! Silakan login.",
      user: {
        name: name || "User",
        email: email,
      },
    }
  } catch (error) {
    console.error("❌ Server Action error:", error)
    return {
      success: false,
      error: "Terjadi kesalahan server. Silakan coba lagi.",
    }
  }
}
