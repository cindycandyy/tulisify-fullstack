"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Search, Plus, Edit, Trash2, Eye, User, LogOut, Filter } from "lucide-react"
import Image from "next/image"
import AddBookForm from "@/components/AddBookForm"

interface Book {
  id: number
  title: string
  author: string
  year: number
  category: string
  cover: string
  file: string
}

export default function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => {
        console.error("Gagal fetch dari /api/books, pakai dummy:", err)
        setBooks([
          {
            id: 1,
            title: "Pulang",
            author: "Tere Liye",
            year: 2015,
            category: "SU",
            cover: "/placeholder.svg?height=200&width=150",
            file: "pulang.pdf",
          },
          {
            id: 2,
            title: "Pergi",
            author: "Tere Liye",
            year: 2018,
            category: "13+",
            cover: "/placeholder.svg?height=200&width=150",
            file: "pergi.pdf",
          },
          {
            id: 3,
            title: "Hello",
            author: "Tere Liye",
            year: 2021,
            category: "18+",
            cover: "/placeholder.svg?height=200&width=150",
            file: "hello.pdf",
          },
        ])
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus buku ini?")) {
      try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" })
        const result = await res.json()

        if (result.success) {
          setBooks(books.filter((book) => book.id !== id))
          alert("Buku berhasil dihapus!")
        } else {
          alert(`Error: ${result.error}`)
        }
      } catch (error) {
        console.error("Error deleting book:", error)
        alert("Terjadi kesalahan saat menghapus buku")
      }
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tulisify Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari buku..."
                  className="pl-10 w-80 h-12 border-slate-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                <User className="w-5 h-5 mr-2" />
                Admin
              </Button>

              <Button variant="ghost" className="text-slate-600 hover:text-red-600">
                <LogOut className="w-5 h-5 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Manajemen Buku</h1>
            <p className="text-slate-600">Kelola koleksi buku digital Anda</p>
          </div>

          <Button
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Buku
          </Button>
        </div>

        {/* Search - Mobile */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari buku..."
              className="pl-10 h-12 border-slate-200 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Buku</p>
                  <p className="text-3xl font-bold text-slate-900">{books.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Kategori SU</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {books.filter((book) => book.category === "SU").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Tahun Terbaru</p>
                  <p className="text-3xl font-bold text-slate-900">{Math.max(...books.map((book) => book.year))}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Books Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Daftar Buku</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">No</TableHead>
                      <TableHead className="font-semibold text-slate-700">Cover</TableHead>
                      <TableHead className="font-semibold text-slate-700">Judul Buku</TableHead>
                      <TableHead className="font-semibold text-slate-700">Pengarang</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tahun</TableHead>
                      <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                      <TableHead className="font-semibold text-slate-700">File</TableHead>
                      <TableHead className="font-semibold text-slate-700">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book, index) => (
                        <TableRow key={book.id} className="border-slate-100 hover:bg-slate-50/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <Image
                              src={book.cover || "/placeholder.svg"}
                              alt={book.title}
                              width={60}
                              height={80}
                              className="rounded-lg object-cover shadow-sm"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 max-w-xs">
                            <div className="truncate">{book.title}</div>
                          </TableCell>
                          <TableCell className="text-slate-600">{book.author}</TableCell>
                          <TableCell className="text-slate-600">{book.year}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                              {book.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-slate-200 hover:border-blue-300"
                            >
                              <a href={`/uploads/${book.file}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </a>
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingBook(book)}
                                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(book.id)}
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-500">Belum ada data buku.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AddBookForm
            onSuccess={() => {
              setShowAddForm(false)
              // Refresh books list
              window.location.reload()
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
    </div>
  )
}
