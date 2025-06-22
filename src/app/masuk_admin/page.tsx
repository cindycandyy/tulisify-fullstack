"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Shield, User, Lock, ArrowLeft } from "lucide-react"

export default function MasukAdminPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (username === "admin123" && password === "123456789") {
        router.push("/manajemen")
      } else {
        setMessage("Username atau password salah!")
      }
      setIsLoading(false)
    }, 1000)
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
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl transform rotate-2"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Panel Administrator</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Kelola sistem perpustakaan digital dengan akses administrator yang aman dan terpercaya.
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
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900">Masuk Admin</CardTitle>
                <p className="text-slate-600">Akses panel administrator</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {message && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Masukkan username"
                        required
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        placeholder="Masukkan password"
                        required
                        className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                  >
                    {isLoading ? "Memverifikasi..." : "Masuk sebagai Admin"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-slate-500">Demo: username: admin123, password: 123456789</p>
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
