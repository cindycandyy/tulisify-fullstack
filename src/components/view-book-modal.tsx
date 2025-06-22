"use client"

import { Button } from "@/components/ui/button"
import { X, BookOpen, User, Calendar, Tag, FileText } from "lucide-react"
import type { Book } from "../lib/supabase"

interface ViewBookModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
  onOpenPdf: () => void
}

export default function ViewBookModal({ isOpen, onClose, book, onOpenPdf }: ViewBookModalProps) {
  if (!isOpen) return null

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Detail Buku</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="flex justify-center">
              <img
                src={book.cover_url || "/placeholder.svg"}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg border shadow-md"
              />
            </div>

            {/* Book Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <User className="w-4 h-4" />
                  <span>oleh {book.author}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tahun Terbit</p>
                    <p className="font-medium text-gray-900">{book.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Kategori</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getCategoryColor(book.category)}`}
                    >
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>

              {book.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}

              <div className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">File PDF</p>
                </div>
                <Button variant="outline" className="w-full" onClick={onOpenPdf}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Buka PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
