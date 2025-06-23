"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, BookOpen, ImageIcon } from "lucide-react"
import type { Book } from "@/lib/supabase"

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onAddBook: (bookData: {
    title: string
    author: string
    year: number
    category: string
    description: string
    coverFile?: File | null
    pdfFile?: File | null
  }) => void
  editMode?: boolean
  initialData?: Book
}

export default function AddBookModal({
  isOpen,
  onClose,
  onSuccess,
  onAddBook,
  editMode,
  initialData,
}: AddBookModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    year: initialData?.year || new Date().getFullYear(),
    category: initialData?.category || "",
    description: initialData?.description || "",
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size must be less than 5MB")
        return
      }

      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file")
        return
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("PDF file size must be less than 50MB")
        return
      }

      setBookFile(file)
      console.log("PDF file selected:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2) + "MB")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill in all required fields")
      return
    }

    if (!editMode && !bookFile) {
      alert("Please select a PDF file")
      return
    }

    setLoading(true)

    try {
      await onAddBook({
        title: formData.title,
        author: formData.author,
        year: formData.year,
        category: formData.category,
        description: formData.description,
        coverFile: coverFile,
        pdfFile: bookFile,
      })

      onSuccess()

      // Reset form
      setFormData({
        title: "",
        author: "",
        year: new Date().getFullYear(),
        category: "",
        description: "",
      })
      setCoverFile(null)
      setBookFile(null)
      setCoverPreview("")
    } catch (error) {
      console.error("Error adding book:", error)
      alert(error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan buku")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (editMode && initialData?.cover_url) {
      setCoverPreview(initialData.cover_url)
    }
  }, [editMode, initialData?.cover_url])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{editMode ? "Edit Buku" : "Tambah Buku Baru"}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Book Info */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Judul Buku <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul buku"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author" className="text-sm font-medium text-gray-700 mb-2 block">
                  Pengarang <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Masukkan nama pengarang"
                  className="w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year" className="text-sm font-medium text-gray-700 mb-2 block">
                    Tahun Terbit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                    Kategori <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SU">SU (Semua Umur)</SelectItem>
                      <SelectItem value="13+">13+ (Remaja)</SelectItem>
                      <SelectItem value="18+">18+ (Dewasa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Masukkan deskripsi buku (opsional)"
                  rows={4}
                  className="w-full resize-none"
                />
              </div>
            </div>

            {/* Right Column - File Uploads */}
            <div className="space-y-6">
              {/* Cover Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Cover Buku</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  {coverPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-32 h-40 object-cover mx-auto rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => {
                          setCoverFile(null)
                          setCoverPreview("")
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-3">Upload cover buku</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild className="bg-white">
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Pilih Gambar
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  File PDF Buku <span className="text-red-500">*</span>
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  {bookFile ? (
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-red-600" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{bookFile.name}</div>
                          <div className="text-xs text-gray-500">{(bookFile.size / 1024 / 1024).toFixed(1)} MB</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setBookFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-3">Upload file PDF buku</p>
                      <Input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleBookFileChange}
                        className="hidden"
                        id="pdf-upload"
                        required={!editMode}
                      />
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild className="bg-white">
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Pilih PDF
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? "Menyimpan..." : editMode ? "Update Buku" : "Simpan Buku"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
