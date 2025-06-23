"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Book,
  Filter,
  Upload,
  X,
  Star,
  Calendar,
  User,
  Tag,
  FileText,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const categories = [
  { value: "SU", label: "Sastra Umum", color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white", icon: "📚" },
  { value: "13+", label: "Remaja 13+", color: "bg-gradient-to-r from-green-500 to-green-600 text-white", icon: "🌟" },
  { value: "FIKSI", label: "Fiksi", color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white", icon: "✨" },
  {
    value: "NON-FIKSI",
    label: "Non-Fiksi",
    color: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    icon: "📖",
  },
  { value: "AKADEMIK", label: "Akademik", color: "bg-gradient-to-r from-red-500 to-red-600 text-white", icon: "🎓" },
]

interface BookType {
  id: number
  title: string
  author: string
  year: number
  category: string
  description?: string
  coverUrl?: string
  pdfUrl?: string
  createdAt: string
  rating?: number
}

export default function BookManagementPage() {
  const [books, setBooks] = useState<BookType[]>([
    {
      id: 1,
      title: "Pulang",
      author: "Tere Liye",
      year: 2015,
      category: "SU",
      description:
        "Novel tentang perjalanan hidup dan makna pulang ke rumah yang penuh dengan emosi dan pembelajaran hidup.",
      coverUrl: "/placeholder.svg?height=160&width=120",
      pdfUrl: "/sample.pdf",
      createdAt: "2024-01-15",
      rating: 4.8,
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
      pdfUrl: "/sample2.pdf",
      createdAt: "2024-01-20",
      rating: 4.6,
    },
    {
      id: 3,
      title: "Bumi",
      author: "Tere Liye",
      year: 2014,
      category: "13+",
      description: "Awal dari serial Bumi tentang petualangan Raib, Ali, dan Seli di dunia paralel yang menakjubkan.",
      coverUrl: "/placeholder.svg?height=160&width=120",
      pdfUrl: "/sample3.pdf",
      createdAt: "2024-01-25",
      rating: 4.9,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<BookType | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    category: "",
    description: "",
    coverFile: null as File | null,
    pdfFile: null as File | null,
  })

  // Filter books based on search and category
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Statistics
  const totalBooks = books.length
  const categoriesCount = [...new Set(books.map((book) => book.category))].length
  const latestYear = Math.max(...books.map((book) => book.year))
  const averageRating = books.reduce((acc, book) => acc + (book.rating || 0), 0) / books.length

  const handleAddBook = () => {
    if (!formData.title || !formData.author || !formData.category) return

    const newBook: BookType = {
      id: Math.max(...books.map((b) => b.id)) + 1,
      title: formData.title,
      author: formData.author,
      year: formData.year,
      category: formData.category,
      description: formData.description,
      coverUrl: formData.coverFile ? URL.createObjectURL(formData.coverFile) : "/placeholder.svg?height=160&width=120",
      pdfUrl: formData.pdfFile ? URL.createObjectURL(formData.pdfFile) : undefined,
      createdAt: new Date().toISOString().split("T")[0],
      rating: 0,
    }

    setBooks([...books, newBook])
    resetForm()
    setIsAddModalOpen(false)
  }

  const handleEditBook = () => {
    if (!editingBook || !formData.title || !formData.author || !formData.category) return

    const updatedBooks = books.map((book) =>
      book.id === editingBook.id
        ? {
            ...book,
            title: formData.title,
            author: formData.author,
            year: formData.year,
            category: formData.category,
            description: formData.description,
            coverUrl: formData.coverFile ? URL.createObjectURL(formData.coverFile) : book.coverUrl,
            pdfUrl: formData.pdfFile ? URL.createObjectURL(formData.pdfFile) : book.pdfUrl,
          }
        : book,
    )

    setBooks(updatedBooks)
    resetForm()
    setIsEditModalOpen(false)
    setEditingBook(null)
  }

  const handleDeleteBook = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      setBooks(books.filter((book) => book.id !== id))
    }
  }

  const openEditModal = (book: BookType) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      year: book.year,
      category: book.category,
      description: book.description || "",
      coverFile: null,
      pdfFile: null,
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      year: new Date().getFullYear(),
      category: "",
      description: "",
      coverFile: null,
      pdfFile: null,
    })
  }

  const getCategoryStyle = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.color : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.label : category
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat ? cat.icon : "📚"
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Book className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tulisify Admin
                </h1>
                <p className="text-sm text-gray-500">Digital Library Management</p>
              </div>
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
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm border-white/20">
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ...books grid... */}
      {filteredBooks.map((book) => (
        <div>
          {/* ... */}
          {book.pdfUrl ? (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/50 border-white/20"
              onClick={() => handleViewPdf(book.pdfUrl!)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Lihat PDF
            </Button>
          ) : (
            <span className="text-xs text-gray-400">Tidak ada PDF</span>
          )}
          {/* ... */}
        </div>
      ))}
      <div className="p-6">
        {/* Page Title and Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Buku</h2>
            <p className="text-gray-600 text-lg">Kelola koleksi buku digital Anda dengan mudah</p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Tambah Buku
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-md">
              <DialogHeader className="pb-6 border-b border-gray-100">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ✨ Tambah Buku Baru
                </DialogTitle>
              </DialogHeader>
              <BookForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddBook}
                onCancel={() => {
                  setIsAddModalOpen(false)
                  resetForm()
                }}
                isEdit={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Buku</p>
                  <p className="text-3xl font-bold">{totalBooks}</p>
                  <p className="text-blue-100 text-xs mt-1">Koleksi lengkap</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Book className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Kategori</p>
                  <p className="text-3xl font-bold">{categoriesCount}</p>
                  <p className="text-green-100 text-xs mt-1">Jenis berbeda</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Filter className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Tahun Terbaru</p>
                  <p className="text-3xl font-bold">{latestYear}</p>
                  <p className="text-purple-100 text-xs mt-1">Publikasi terkini</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Rating Rata-rata</p>
                  <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                  <p className="text-orange-100 text-xs mt-1">Dari 5 bintang</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Label htmlFor="category-filter" className="text-sm font-semibold text-gray-700">
                  🔍 Filter Kategori:
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-64 bg-white/50 border-white/20">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">📚 Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-full">
                Menampilkan <span className="font-semibold text-blue-600">{filteredBooks.length}</span> dari{" "}
                <span className="font-semibold">{totalBooks}</span> buku
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">📖 Daftar Buku</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Book className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada buku ditemukan</h3>
                <p className="text-gray-500">Coba ubah filter atau tambah buku baru</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        {/* Book Cover */}
                        <div className="flex-shrink-0">
                          <img
                            src={book.coverUrl || "/placeholder.svg"}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-lg shadow-md border-2 border-white/50"
                          />
                        </div>

                        {/* Book Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{book.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditModal(book)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBook(book.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              {book.author}
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {book.year}
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge className={`${getCategoryStyle(book.category)} shadow-sm`}>
                                {getCategoryIcon(book.category)} {getCategoryLabel(book.category)}
                              </Badge>
                              {book.rating && (
                                <div className="flex items-center text-sm text-yellow-600">
                                  <Star className="w-4 h-4 mr-1 fill-current" />
                                  {book.rating}
                                </div>
                              )}
                            </div>

                            {book.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mt-2">{book.description}</p>
                            )}

                            <div className="flex items-center justify-between pt-2">
                              {book.pdfUrl ? (
                                <Button variant="outline" size="sm" className="bg-white/50 border-white/20">
                                  <Eye className="w-4 h-4 mr-1" />
                                  Lihat PDF
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-400">Tidak ada PDF</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-md">
            <DialogHeader className="pb-6 border-b border-gray-100">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ✏️ Edit Buku
              </DialogTitle>
            </DialogHeader>
            <BookForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditBook}
              onCancel={() => {
                setIsEditModalOpen(false)
                setEditingBook(null)
                resetForm()
              }}
              isEdit={true}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Enhanced Book Form Component
function BookForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
  isEdit: boolean
}) {
  const handleFileChange = (field: "coverFile" | "pdfFile", file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
      {/* Left Column - Form Fields */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Informasi Buku
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                <Book className="w-4 h-4 mr-2" />
                Judul Buku *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul buku"
                className="bg-white/70 border-white/20 focus:bg-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="author" className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Pengarang *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Masukkan nama pengarang"
                className="bg-white/70 border-white/20 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year" className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Tahun Terbit *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="bg-white/70 border-white/20 focus:bg-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Kategori *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-white/70 border-white/20 focus:bg-white">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Deskripsi
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi buku (opsional)"
                rows={4}
                className="bg-white/70 border-white/20 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - File Uploads */}
      <div className="space-y-6">
        {/* Cover Upload */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
          <Label className="text-sm font-semibold text-gray-700 flex items-center mb-4">
            <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
            Cover Buku
          </Label>
          <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors bg-white/50">
            {formData.coverFile ? (
              <div className="space-y-4">
                <img
                  src={URL.createObjectURL(formData.coverFile) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-32 h-44 object-cover mx-auto rounded-lg shadow-lg border-2 border-white"
                />
                <p className="text-sm font-medium text-gray-700">{formData.coverFile.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileChange("coverFile", null)}
                  className="bg-white/70 border-white/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("cover-upload")?.click()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Pilih Gambar
                  </Button>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange("coverFile", e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-xs text-gray-500">PNG, JPG hingga 5MB</p>
              </div>
            )}
          </div>
        </div>

        {/* PDF Upload */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
          <Label className="text-sm font-semibold text-gray-700 flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            File PDF Buku *
          </Label>
          <div className="border-2 border-dashed border-green-200 rounded-xl p-8 text-center hover:border-green-300 transition-colors bg-white/50">
            {formData.pdfFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">{formData.pdfFile.name}</p>
                <p className="text-xs text-gray-500">{(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFileChange("pdfFile", null)}
                  className="bg-white/70 border-white/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("pdf-upload")?.click()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Pilih PDF
                  </Button>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileChange("pdfFile", e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-xs text-gray-500">PDF hingga 50MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="lg:col-span-2 flex justify-end space-x-4 pt-6 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} className="px-8 py-3 bg-white/70 border-white/20">
          Batal
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!formData.title || !formData.author || !formData.category}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isEdit ? "💾 Update Buku" : "✨ Simpan Buku"}
        </Button>
      </div>
    </div>
  )
}


