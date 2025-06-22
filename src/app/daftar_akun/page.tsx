"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Mail, Lock, User, ArrowLeft } from "lucide-react"

export default function DaftarAkunPage() {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setMessage("Registrasi berhasil! Silakan login.")
        setTimeout(() => router.push("/login"), 1500)
      } else {
        setMessage(data.msg || "Registrasi gagal.")
      }
    } catch (err) {
      setMessage("Terjadi kesalahan pada server.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tulisify
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Illustration */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Bergabung dengan Tulisify</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Akses ribuan buku digital, buat koleksi pribadi, dan nikmati pengalaman membaca yang tak terbatas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Daftar Akun</CardTitle>
                <p className="text-slate-600">Buat akun baru untuk memulai</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {message && (
                    <Alert
                      className={
                        message.includes("berhasil") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                      }
                    >
                      <AlertDescription className={message.includes("berhasil") ? "text-green-800" : "text-red-800"}>
                        {message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="nama@email.com"
                        required
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Minimal 8 karakter"
                        required
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <p className="text-sm text-slate-500">Minimal 8 karakter, kombinasi huruf dan angka</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                  >
                    {isLoading ? "Mendaftar..." : "Daftar Akun"}
                  </Button>

                  <div className="text-center">
                    <p className="text-slate-600">
                      Sudah punya akun?{" "}
                      <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Masuk di sini
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
