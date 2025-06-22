"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Download, User, LogOut, Filter } from "lucide-react"
import { useBooks } from "@/presentation/hooks/useBooks"
import { useAuth } from "@/presentation/hooks/useAuth"
import type { BookCategory } from "@/domain/entities/Book"

import type { JSX } from "react"

export default function ListBooksPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | "all">("all")

  const { books, loading, error } = useBooks({
    search: searchTerm,
    category: selectedCategory,
  })

  const { user, logout } = useAuth()

  const categories: Array<BookCategory | "all"> = ["all", "SU", "13+", "18+"]

  const handleLogout = async (): Promise<void> => {
    await logout()
    window.location.href = "/"
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari buku atau penulis..."
                  className="pl-10 w-80 h-12 border-slate-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {user && (
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                  <User className="w-5 h-5 mr-2" />
                  {user.email}
                </Button>
              )}

              <Button variant="ghost" className="text-slate-600 hover:text-red-600" onClick={handleLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Koleksi Buku Digital</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Jelajahi ribuan buku dari berbagai kategori dan penulis terbaik
          </p>
        </div>

        {/* Search and Filter - Mobile */}
        <div className="md:hidden mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari buku atau penulis..."
              className="pl-10 h-12 border-slate-200 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "border-slate-200 hover:border-blue-300"
              }
            >
              <Filter className="w-4 h-4 mr-2" />
              {category === "all" ? "Semua" : category}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Tidak ada buku ditemukan</h3>
            <p className="text-slate-500">Coba ubah kata kunci pencarian atau filter kategori</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.map((book) => (
              <Card
                key={book.id}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={book.cover ? (book.cover.startsWith("http") ? book.cover : `http://localhost:4000/${book.cover}`) : "/placeholder.jpg"}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-700 font-medium">
                      {book.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-slate-600 mb-1">
                    <span className="font-medium">Penulis:</span> {book.author}
                  </p>
                  <p className="text-slate-600 mb-4">
                    <span className="font-medium">Tahun:</span> {book.year}
                  </p>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <a
                      href={book.file ? (book.file.startsWith("http") ? book.file : `http://localhost:4000/${book.file}`) : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Buku
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}