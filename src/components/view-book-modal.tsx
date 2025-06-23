"use client"

import { Button } from "@/components/ui/button"
import { X, Calendar, User, Tag, Eye } from "lucide-react"
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detail Buku</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <img
                src={book.cover_url || "/placeholder.svg?height=200&width=150"}
                alt={book.title}
                className="w-32 h-44 object-cover rounded-lg shadow-md border"
              />
            </div>

            {/* Book Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium">Pengarang:</span>
                    <span className="ml-2">{book.author}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="font-medium">Tahun:</span>
                    <span className="ml-2">{book.year}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="font-medium">Kategori:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getCategoryColor(book.category)}`}>
                      {book.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Deskripsi:</h4>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* File Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">File Tersedia:</h4>
                <div className="flex gap-2">
                  {book.pdf_url && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded bg-red-100 text-red-700">
                      📄 PDF
                    </span>
                  )}
                  {book.cover_url && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-700">
                      🖼️ Cover
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          {book.pdf_url && (
            <Button onClick={onOpenPdf} className="bg-blue-600 hover:bg-blue-700">
              <Eye className="w-4 h-4 mr-2" />
              Buka PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
