"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"

// Data dummy untuk demo
const dummyBooks = [
  {
    id: 1,
    title: "Belajar React untuk Pemula",
    author: "John Doe",
    year: 2024,
    category: "Programming",
    description: "Panduan lengkap belajar React dari dasar hingga mahir",
  },
  {
    id: 2,
    title: "Mastering Next.js",
    author: "Jane Smith",
    year: 2024,
    category: "Web Development",
    description: "Teknik advanced untuk mengembangkan aplikasi dengan Next.js",
  },
  {
    id: 3,
    title: "Database Design Patterns",
    author: "Bob Wilson",
    year: 2023,
    category: "Database",
    description: "Pola-pola desain database yang efektif dan scalable",
  },
]

export default function ManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState(dummyBooks)

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) {
      setBooks(books.filter((book) => book.id !== id))
      alert("Buku berhasil dihapus!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-blue-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tulisify Management
                </span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Buku
            </Button>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Management Panel
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Perpustakaan Digital
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Kelola koleksi buku digital Anda dengan mudah</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari buku untuk dikelola..."
              className="pl-12 pr-4 py-3 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Management Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-8">
          <p className="text-slate-600">
            Total <span className="font-semibold">{filteredBooks.length}</span> buku ditemukan
          </p>
        </div>

        <div className="grid gap-4">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Book Cover Thumbnail */}
                  <div className="w-16 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-slate-600 mb-1">oleh {book.author}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-2">
                      <span>Tahun: {book.year}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{book.category}</span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{book.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(book.id, book.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Tidak ada buku ditemukan</h3>
            <p className="text-slate-500">Coba ubah kata kunci pencarian Anda</p>
          </div>
        )}
      </section>
    </div>
  )
}
