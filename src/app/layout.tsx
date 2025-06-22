import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tulisify - Perpustakaan Digital Masa Depan',
  description: 'Akses ribuan buku digital dengan mudah. Baca, unduh, dan kelola koleksi buku Anda dalam satu platform yang modern dan intuitif.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
