import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Download, 
  User, 
  LogOut, 
  Filter, 
  Plus, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

// PDF Reader Modal Component - FIXED VERSION
type PdfReaderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    author: string;
    [key: string]: any;
  } | null;
};

const PdfReaderModal: React.FC<PdfReaderModalProps> = ({ isOpen, onClose, book }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Simulated total pages
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setZoom(100);
      setRotation(0);
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25);
    }
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="hover:bg-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2 min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="hover:bg-gray-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="hover:bg-gray-200"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">
              {zoom}%
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="hover:bg-gray-200"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRotate}
              className="hover:bg-gray-200"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-100">
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-auto p-4">
          <div 
            className="bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div className="p-8 max-w-4xl w-full">
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
                    Halaman {currentPage} dari {totalPages} - Zoom: {zoom}% - Rotasi: {rotation}°
                  </p>
                </div>

                {/* Simulated PDF Page Content */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 shadow-inner min-h-[500px] flex flex-col justify-start">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{book.title}</h4>
                    <p className="text-gray-600 mb-2">Pengarang: {book.author}</p>
                    <p className="text-gray-600 mb-4">Halaman {currentPage}</p>
                  </div>
                  
                  {/* Simulated text content that changes per page */}
                  <div className="space-y-3 text-left">
                    {Array.from({ length: 8 + (currentPage % 3) }).map((_, i) => (
                      <div 
                        key={i} 
                        className="h-4 bg-gray-200 rounded animate-pulse" 
                        style={{ 
                          width: `${Math.random() * 30 + 70}%`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Page-specific content */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {currentPage === 1 && "Ini adalah halaman pertama dari buku ini..."}
                      {currentPage === 2 && "Melanjutkan pembahasan dari halaman sebelumnya..."}
                      {currentPage === 3 && "Pada bab ini kita akan membahas..."}
                      {currentPage > 3 && `Konten halaman ${currentPage} sedang dimuat...`}
                    </p>
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="flex justify-center items-center gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Sebelumnya
                  </Button>
                  <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Library Component with Fixed Logout
export default function LibraryWithWorkingPDFReader() {
  const [books, setBooks] = useState([
    {
      id: '1',
      title: 'Mobile Programming',
      author: 'Cindy Revalia',
      year: 2025,
      category: '18+',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
      file: 'https://example.com/mobile-programming.pdf',
      description: 'Panduan lengkap pemrograman mobile untuk pemula hingga expert'
    },
    {
      id: '2',
      title: 'Web Development Fundamentals',
      author: 'John Doe',
      year: 2024,
      category: '13+',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
      file: 'https://example.com/web-dev.pdf',
      description: 'Belajar dasar-dasar pengembangan web modern'
    },
    {
      id: '3',
      title: 'Data Science with Python',
      author: 'Jane Smith',
      year: 2023,
      category: 'SU',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop',
      file: 'https://example.com/data-science.pdf',
      description: 'Menguasai data science menggunakan Python'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [appUser, setAppUser] = useState<{ 
    id: string; 
    email: string; 
    role: string; 
  } | null>({
    id: '1', 
    email: 'admin@tulisify.com', 
    role: 'admin' 
  });
  
  // Modal states
  const [pdfReaderModal, setPdfReaderModal] = useState<{
    isOpen: boolean;
    book: {
      id: string;
      title: string;
      author: string;
      year: number;
      category: string;
      cover: string;
      file: string;
      description: string;
    } | null;
  }>({ isOpen: false, book: null });

  const categories = ["all", "SU", "13+", "18+"];

  // FIXED: Logout function
  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmLogout) {
      // Clear user data (in real app, you'd clear localStorage/sessionStorage)
      setAppUser(null);
      
      // Show logout success message
      alert('Anda telah berhasil keluar');
      
      // In real app, you would redirect to login page
      // For demo purposes, we'll reset the user after 2 seconds
      setTimeout(() => {
        setAppUser({ 
          id: '1', 
          email: 'admin@tulisify.com', 
          role: 'admin' 
        });
      }, 2000);
    }
  };

  // Filter books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === "" ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // FIXED: View book function
  const handleViewBook = (book: {
    id: string;
    title: string;
    author: string;
    year: number;
    category: string;
    cover: string;
    file: string;
    description: string;
  }) => {
    console.log('Opening PDF reader for:', book.title);
    setPdfReaderModal({ isOpen: true, book });
  };

  const handleDownload = (book: {
    id: string;
    title: string;
    author: string;
    year: number;
    category: string;
    cover: string;
    file: string;
    description: string;
  }) => {
    if (book.file) {
      // Simulate download
      const link = document.createElement('a');
      link.href = book.file;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Mengunduh: ${book.title}`);
    } else {
      alert("File buku tidak tersedia");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tulisify
              </span>
            </div>

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

              {appUser && (
                <>
                  <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                    <User className="w-5 h-5 mr-2" />
                    {appUser.email}
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="text-slate-600 hover:text-red-600" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Keluar
                  </Button>
                </>
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
                  <img
                    src={book.cover || "/placeholder.svg?height=400&width=300"}
                    alt={book.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-slate-700 font-medium">
                      {book.category}
                    </Badge>
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
                  {book.description && (
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{book.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBook(book)}
                        className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Baca
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(book)}
                        className="flex-1 hover:bg-green-50 hover:border-green-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PDF Reader Modal */}
      <PdfReaderModal
        isOpen={pdfReaderModal.isOpen}
        onClose={() => setPdfReaderModal({ isOpen: false, book: null })}
        book={pdfReaderModal.book}
      />
    </div>
  );
}