-- Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books(author);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON public.books(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on books" ON public.books
FOR ALL USING (true) WITH CHECK (true);

-- Insert sample data
INSERT INTO public.books (title, author, year, category, description, cover_url) VALUES
('Pulang', 'Tere Liye', 2015, 'SU', 'Novel tentang perjalanan pulang ke kampung halaman yang penuh makna dan emosi mendalam.', '/placeholder.svg?height=200&width=150'),
('Pergi', 'Tere Liye', 2018, '13+', 'Kelanjutan dari novel Pulang yang mengisahkan petualangan baru dengan karakter yang lebih matang.', '/placeholder.svg?height=200&width=150'),
('Hello', 'Tere Liye', 2021, '18+', 'Novel tentang persahabatan dan cinta yang mengharukan dengan twist yang tak terduga.', '/placeholder.svg?height=200&width=150'),
('Bumi', 'Tere Liye', 2014, 'SU', 'Awal dari serial Bumi yang mengisahkan petualangan Raib, Ali, dan Seli di dunia paralel.', '/placeholder.svg?height=200&width=150'),
('Bulan', 'Tere Liye', 2015, '13+', 'Kelanjutan serial Bumi dengan petualangan yang lebih menantang dan karakter yang berkembang.', '/placeholder.svg?height=200&width=150')
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for book files (covers and PDFs)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for books bucket
CREATE POLICY "Allow public access to books bucket" ON storage.objects
FOR ALL USING (bucket_id = 'books');
