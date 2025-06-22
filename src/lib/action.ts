"use server"

export async function registerUser(formData: FormData) {
  console.log("🔥 Server Action: registerUser called")

  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("📥 Received data:", { name, email, password: "***" })

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Format email tidak valid",
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

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
