"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search, Download, User, LogOut, Filter, Plus, Eye, Star } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  year: number
  category: "SU" | "13+" | "18+" | "FIKSI" | "NON-FIKSI" | "AKADEMIK"
  cover?: string
  file?: string
  description?: string
  rating?: number
  views?: number
  downloads?: number
}

interface AppUser {
  id: string
  email: string
  role: "admin" | "user"
}

export default function ListBooksPage() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Pulang",
      author: "Tere Liye",
      year: 2015,
      category: "SU",
      description:
        "Novel tentang perjalanan hidup dan makna pulang ke rumah yang penuh dengan emosi dan pembelajaran hidup.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample.pdf",
      rating: 4.8,
      views: 1250,
      downloads: 340,
    },
    {
      id: "2",
      title: "Pergi",
      author: "Tere Liye",
      year: 2018,
      category: "13+",
      description:
        "Kelanjutan dari novel Pulang, mengisahkan petualangan baru yang penuh dengan tantangan dan pembelajaran.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample2.pdf",
      rating: 4.6,
      views: 980,
      downloads: 275,
    },
    {
      id: "3",
      title: "Bumi",
      author: "Tere Liye",
      year: 2014,
      category: "13+",
      description: "Awal dari serial Bumi tentang petualangan Raib, Ali, dan Seli di dunia paralel yang menakjubkan.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample3.pdf",
      rating: 4.9,
      views: 1580,
      downloads: 420,
    },
    {
      id: "4",
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      year: 2005,
      category: "FIKSI",
      description: "Kisah inspiratif tentang perjuangan anak-anak Belitung untuk mendapatkan pendidikan.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample4.pdf",
      rating: 4.7,
      views: 2100,
      downloads: 580,
    },
    {
      id: "5",
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      year: 2018,
      category: "NON-FIKSI",
      description: "Panduan praktis menerapkan filosofi Stoikisme dalam kehidupan sehari-hari.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample5.pdf",
      rating: 4.5,
      views: 1800,
      downloads: 450,
    },
    {
      id: "6",
      title: "Algoritma dan Pemrograman",
      author: "Dr. Rinaldi Munir",
      year: 2020,
      category: "AKADEMIK",
      description: "Buku panduan lengkap untuk mempelajari algoritma dan teknik pemrograman.",
      cover: "/placeholder.svg?height=400&width=300",
      file: "/sample6.pdf",
      rating: 4.3,
      views: 950,
      downloads: 320,
    },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "SU" | "13+" | "18+" | "FIKSI" | "NON-FIKSI" | "AKADEMIK"
  >("all")
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const categories = ["all", "SU", "13+", "18+", "FIKSI", "NON-FIKSI", "AKADEMIK"] as const

  // Load user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        setAppUser(JSON.parse(userData))
      } catch (e) {
        console.error("Error parsing user data:", e)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("user")
      window.location.href = "/"
    }
  }

  const handleReadBook = (book: Book) => {
    if (!appUser) {
      setShowLoginPrompt(true)
      return
    }

    // Increment views
    setBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, views: (b.views || 0) + 1 } : b)))

    if (book.file) {
      window.open(book.file, "_blank")
    } else {
      alert("File buku tidak tersedia")
    }
  }

  const handleDownloadBook = (book: Book) => {
    if (!appUser) {
      setShowLoginPrompt(true)
      return
    }

    // Increment downloads
    setBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, downloads: (b.downloads || 0) + 1 } : b)))

    if (book.file) {
      // Create download link
      const link = document.createElement("a")
      link.href = book.file
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert("File buku tidak tersedia")
    }
  }

  // Filter books based on search and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Render category buttons
  {categories.map((category) => {
    const isActive = selectedCategory === category;
    return (
      <Button
  key={category}
  variant="ghost" // Atau hilangkan variant agar tidak override
  onClick={() => setSelectedCategory(category)}
  className={
    isActive
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold border-blue-700 shadow hover:from-blue-700 hover:to-indigo-700"
      : "bg-white text-slate-800 border-slate-300 font-semibold hover:bg-slate-100 hover:border-blue-500"
  }
>
  <Filter className={`w-5 h-5 mr-2 ${isActive ? "text-white" : "text-blue-600"}`} />
  {category === "all" ? "Semua" : category}
</Button>
    );
  })}

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SU":
        return "bg-blue-600 text-white font-semibold border border-blue-700"
      case "13+":
        return "bg-green-600 text-white font-semibold border border-green-700"
      case "18+":
        return "bg-red-600 text-white font-semibold border border-red-700"
      case "FIKSI":
        return "bg-purple-600 text-white font-semibold border border-purple-700"
      case "NON-FIKSI":
        return "bg-orange-500 text-white font-semibold border border-orange-600"
      case "AKADEMIK":
        return "bg-gray-800 text-white font-semibold border border-gray-900"
      default:
        return "bg-gray-400 text-white font-semibold border border-gray-500"
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Coba Lagi</Button>
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

              {appUser?.role === "admin" && (
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/manajemen">
                    <Plus className="w-4 h-4 mr-2" />
                    Kelola Buku
                  </Link>
                </Button>
              )}

              {appUser ? (
                <>
                  <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                    <User className="w-5 h-5 mr-2" />
                    {appUser.email}
                  </Button>
                  <Button variant="ghost" className="text-slate-600 hover:text-red-600" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-2" />
                    Keluar
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" className="text-slate-600 hover:text-blue-600">
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/daftar-akun">Daftar</Link>
                </Button>
                </div>
              )}
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

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">{books.length}</div>
              <div className="text-sm text-slate-600">Total Buku</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-green-600">
                {books.reduce((acc, book) => acc + (book.views || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Views</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">
                {books.reduce((acc, book) => acc + (book.downloads || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Downloads</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(books.reduce((acc, book) => acc + (book.rating || 0), 0) / books.length).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">Rating Rata-rata</div>
            </div>
          </div>
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
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {books.length === 0 ? "Belum ada buku tersedia" : "Tidak ada buku ditemukan"}
            </h3>
            <p className="text-slate-500">
              {books.length === 0
                ? "Admin belum menambahkan buku ke perpustakaan"
                : "Coba ubah kata kunci pencarian atau filter kategori"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={book.cover || "/placeholder.svg?height=400&width=300"}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getCategoryColor(book.category)} font-medium`}>{book.category}</Badge>
                  </div>
                  {book.rating && (
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {book.rating}
                      </div>
                    </div>
                  )}
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

                  {/* Book Stats */}
                  <div className="flex justify-between text-xs text-slate-500 mb-4">
                    <span>👁️ {book.views?.toLocaleString()} views</span>
                    <span>📥 {book.downloads?.toLocaleString()} downloads</span>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition"
                      onClick={() => handleReadBook(book)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Baca Buku
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:border-blue-400 hover:bg-blue-50 font-semibold transition"
                      onClick={() => handleDownloadBook(book)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                      </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
              <p className="text-gray-600 mb-6">Untuk membaca dan mengunduh buku, Anda harus login terlebih dahulu.</p>
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
  )
}
