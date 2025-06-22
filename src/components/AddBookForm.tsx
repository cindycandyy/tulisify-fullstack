"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, BookOpen, ImageIcon } from "lucide-react"

interface AddBookFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddBookForm({ onSuccess, onCancel }: AddBookFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    year: new Date().getFullYear(),
    category: "",
    description: "",
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
      setCoverFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setBookFile(file)
    } else {
      alert("Please select a PDF file")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("author", formData.author)
      submitData.append("year", formData.year.toString())
      submitData.append("category", formData.category)
      submitData.append("description", formData.description)

      if (coverFile) submitData.append("cover", coverFile)
      if (bookFile) submitData.append("file", bookFile)

      const response = await fetch("/api/books", {
        method: "POST",
        body: submitData,
      })

      const result = await response.json()

      if (result.success) {
        alert("Buku berhasil ditambahkan!")
        onSuccess()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error adding book:", error)
      alert("Terjadi kesalahan saat menambahkan buku")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Tambah Buku Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Book Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Buku *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul buku"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author">Pengarang *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Masukkan nama pengarang"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Tahun Terbit *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategori *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
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
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Masukkan deskripsi buku (opsional)"
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column - File Uploads */}
            <div className="space-y-4">
              {/* Cover Upload */}
              <div>
                <Label>Cover Buku</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview || "/placeholder.svg"}
                        alt="Cover preview"
                        className="w-32 h-40 object-cover mx-auto rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => {
                          setCoverFile(null)
                          setCoverPreview("")
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload cover buku</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="hidden"
                        id="cover-upload"
                      />
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
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
                <Label>File PDF Buku *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {bookFile ? (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium">{bookFile.name}</span>
                        <span className="text-xs text-gray-500">({(bookFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setBookFile(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload file PDF buku</p>
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleBookFileChange}
                        className="hidden"
                        id="pdf-upload"
                        required
                      />
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
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
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Menyimpan..." : "Simpan Buku"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
