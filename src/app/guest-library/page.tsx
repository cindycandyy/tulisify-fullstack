"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BookOpen, Eye, Download, Star, Filter } from "lucide-react"
import Link from "next/link"

// Sample books data - in real app this would come from API
const sampleBooks = [
  {
    id: 1,
    title: "Pulang",
    author: "Tere Liye",
    year: 2015,
    category: "SU",
    description:
      "Novel tentang perjalanan hidup dan makna pulang ke rumah yang penuh dengan emosi dan pembelajaran hidup.",
    coverUrl: "/placeholder.svg?height=160&width=120",
    rating: 4.8,
    views: 1250,
    downloads: 340,
  },
  {
    id: 2,
    title: "Pergi",
    author: "Tere Liye",
    year: 2018,
    category: "13+",
    description:
      "Kelanjutan dari novel Pulang, mengisahkan petualangan baru yang penuh dengan tantangan dan pembelajaran.",
    coverUrl: "/placeholder.svg?height=160&width=120",
    rating: 4.6,
    views: 980,
    downloads: 275,
  },
  {
    id: 3,
    title: "Bumi",
    author: "Tere Liye",
    year: 2014,
    category: "13+",
    description: "Awal dari serial Bumi tentang petualangan Raib, Ali, dan Seli di dunia paralel yang menakjubkan.",
    coverUrl: "/placeholder.svg?height=160&width=120",
    rating: 4.9,
    views: 1580,
    downloads: 420,
  },
]

export default function GuestLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const filteredBooks = sampleBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleReadBook = () => {
    setShowLoginPrompt(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tulisify Library
              </h1>
              <p className="text-sm text-gray-500">Perpustakaan Digital</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari buku atau pengarang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 bg-white/50 backdrop-blur-sm border-white/20 focus:bg-white/80"
              />
            </div>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Jelajahi Koleksi Buku Digital</h1>
            <p className="text-xl text-blue-100 mb-8">Temukan ribuan buku dari berbagai kategori dan penulis terbaik</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {["all", "SU", "13+", "18+"].map((category) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {book.rating}
                  </div>
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
                {book.description && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{book.description}</p>}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReadBook}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Baca
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReadBook}
                      className="flex-1 hover:bg-green-50 hover:border-green-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Unduh
                    </Button>
                  </div>

                  {/* Book Stats */}
                  <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>👁️ {book.views.toLocaleString()} views</span>
                    <span>📥 {book.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Login Prompt Modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Login Diperlukan</h3>
                <p className="text-gray-600 mb-6">
                  Untuk membaca dan mengunduh buku, Anda harus login terlebih dahulu.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => setShowLoginPrompt(false)} variant="outline" className="flex-1">
                    Batal
                  </Button>
                  <Link href="/login" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Login Sekarang</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
