"use client"

import { Button } from "@/components/ui/button"
import { X, BookOpen, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react"
import type { Book } from "../lib/supabase"

interface PdfReaderModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
}

export default function PdfReaderModal({ isOpen, onClose, book }: PdfReaderModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[95vh] flex flex-col">
        {/* PDF Reader Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{book.title}</h2>
              <p className="text-sm text-gray-600">oleh {book.author}</p>
            </div>
          </div>

          {/* PDF Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">1 / 10</span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">100%</span>
            <Button variant="ghost" size="sm">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <RotateCw className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full mx-4">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">PDF Reader</h3>
                <p className="text-gray-600 mb-4">
                  Sedang membaca: <strong>"{book.title}"</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Dalam implementasi nyata, konten PDF akan ditampilkan di sini menggunakan library seperti react-pdf
                  atau pdf.js
                </p>
              </div>

              {/* Simulated PDF Page */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-inner min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{book.title}</h4>
                  <p className="text-gray-600 mb-4">Halaman 1</p>
                  <div className="space-y-2 text-left max-w-md">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              <Button variant="outline" onClick={onClose} className="mt-6">
                Tutup Reader
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
