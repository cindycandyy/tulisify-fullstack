"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, User, LogOut, BookOpen, Filter, Calendar, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import AddBookModal from "@/components/add-book-modal"
import ViewBookModal from "@/components/view-book-modal"
import PdfReaderModal from "@/components/pdf-reader-modal"
import { useToast } from "../../hooks/use-toast"
import { useBooks } from "../../hooks/use-books"
import type { Book } from "../../lib/supabase"

export default function ManajemenPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showPdfReader, setShowPdfReader] = useState(false)
  const { toast } = useToast()

  const { books, loading, error, addBook, updateBook, deleteBook, uploadFile } = useBooks(searchQuery)

  const handleAddBook = async (newBookData: {
    title: string
    author: string
    year: number
    category: string
    description: string
    coverFile?: File | null
    pdfFile?: File | null
  }) => {
    try {
      let coverUrl = ""
      let pdfUrl = ""

      // Upload cover if provided
      if (newBookData.coverFile) {
        console.log("Uploading cover file...")
        coverUrl = await uploadFile(newBookData.coverFile, "cover")
        console.log("Cover uploaded:", coverUrl)
      }

      // Upload PDF if provided
      if (newBookData.pdfFile) {
        console.log("Uploading PDF file...")
        pdfUrl = await uploadFile(newBookData.pdfFile, "pdf")
        console.log("PDF uploaded:", pdfUrl)
      }

      // Add book with file URLs
      await addBook({
        title: newBookData.title,
        author: newBookData.author,
        year: newBookData.year,
        category: newBookData.category,
        description: newBookData.description,
        cover_url: coverUrl,
        pdf_url: pdfUrl,
      })

      toast({
        title: "Berhasil!",
        description: `Buku "${newBookData.title}" berhasil ditambahkan.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error adding book:", error)
      toast({
        title: "Error!",
        description: error instanceof Error ? error.message : "Gagal menambahkan buku",
        variant: "error",
      })
      throw error // Re-throw to prevent modal from closing
    }
  }

  const handleDeleteBook = async (bookId: number) => {
    const bookToDelete = books.find((book) => book.id === bookId)
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await deleteBook(bookId)
        toast({
          title: "Buku Dihapus",
          description: `Buku "${bookToDelete?.title}" berhasil dihapus.`,
          variant: "success",
        })
      } catch (error) {
        toast({
          title: "Error!",
          description: error instanceof Error ? error.message : "Gagal menghapus buku",
          variant: "error",
        })
      }
    }
  }

  const handleEditBook = (book: Book) => {
    setSelectedBook(book)
    setShowEditModal(true)
  }

  const handleViewBook = (book: Book) => {
    setSelectedBook(book)
    setShowViewModal(true)
  }

  const handleOpenPdf = (book: Book) => {
    setSelectedBook(book)
    setShowViewModal(false)
    setShowPdfReader(true)
    toast({
      title: "Membuka PDF",
      description: `Sedang memuat "${book.title}"...`,
      variant: "default",
    })
  }

  const handleUpdateBook = async (updatedBookData: {
    title: string
    author: string
    year: number
    category: string
    description: string
    coverFile?: File | null
    pdfFile?: File | null
  }) => {
    if (selectedBook) {
      try {
        let coverUrl = selectedBook.cover_url || ""
        let pdfUrl = selectedBook.pdf_url || ""

        // Upload new cover if provided
        if (updatedBookData.coverFile) {
          coverUrl = await uploadFile(updatedBookData.coverFile, "cover")
        }

        // Upload new PDF if provided
        if (updatedBookData.pdfFile) {
          pdfUrl = await uploadFile(updatedBookData.pdfFile, "pdf")
        }

        await updateBook(selectedBook.id, {
          title: updatedBookData.title,
          author: updatedBookData.author,
          year: updatedBookData.year,
          category: updatedBookData.category,
          description: updatedBookData.description,
          cover_url: coverUrl,
          pdf_url: pdfUrl,
        })

        toast({
          title: "Berhasil Diperbarui!",
          description: `Buku "${updatedBookData.title}" berhasil diperbarui.`,
          variant: "success",
        })
      } catch (error) {
        toast({
          title: "Error!",
          description: error instanceof Error ? error.message : "Gagal memperbarui buku",
          variant: "error",
        })
        throw error
      }
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SU":
        return "bg-blue-100 text-blue-700 border border-blue-200"
      case "13+":
        return "bg-purple-100 text-purple-700 border border-purple-200"
      case "18+":
        return "bg-red-100 text-red-700 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const totalBooks = books.length
  const suBooks = books.filter((book) => book.category === "SU").length
  const latestYear = books.length > 0 ? Math.max(...books.map((book) => book.year)) : new Date().getFullYear()

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Tulsify Admin</h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari buku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                <LogOut className="w-4 h-4 mr-1" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Buku</p>
                  <p className="text-3xl font-bold text-gray-900">{totalBooks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Kategori SU</p>
                  <p className="text-3xl font-bold text-gray-900">{suBooks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tahun Terbaru</p>
                  <p className="text-3xl font-bold text-gray-900">{latestYear}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6 flex items-center justify-center">
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Buku
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-sm border-0">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Daftar Buku</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Memuat data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NO
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      COVER
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      JUDUL BUKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PENGARANG
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TAHUN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KATEGORI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FILE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AKSI
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map((book, index) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={book.cover_url || "/placeholder.svg"}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded border"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{book.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getCategoryColor(book.category)}`}
                        >
                          {book.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {book.pdf_url && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                              PDF
                            </span>
                          )}
                          {book.cover_url && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                              IMG
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewBook(book)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            onClick={() => handleEditBook(book)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false)
        }}
        onAddBook={handleAddBook}
      />

      {/* Edit Book Modal */}
      {showEditModal && selectedBook && (
        <AddBookModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedBook(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedBook(null)
          }}
          onAddBook={handleUpdateBook}
          editMode={true}
          initialData={selectedBook}
        />
      )}

      {/* View Book Modal */}
      {showViewModal && selectedBook && (
        <ViewBookModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedBook(null)
          }}
          book={selectedBook}
          onOpenPdf={() => handleOpenPdf(selectedBook)}
        />
      )}

      {/* PDF Reader Modal */}
      {showPdfReader && selectedBook && (
        <PdfReaderModal
          isOpen={showPdfReader}
          onClose={() => {
            setShowPdfReader(false)
            setSelectedBook(null)
          }}
          book={selectedBook}
        />
      )}
    </div>
  )
}
