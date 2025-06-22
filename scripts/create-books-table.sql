-- Create books table
CREATE TABLE IF NOT EXISTS books (
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

-- Create an index on title for faster searching
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);

-- Insert sample data
INSERT INTO books (title, author, year, category, description, cover_url) VALUES
('Pulang', 'Tere Liye', 2015, 'SU', 'Novel tentang perjalanan pulang ke kampung halaman', '/placeholder.svg?height=60&width=45'),
('Pergi', 'Tere Liye', 2018, '13+', 'Kelanjutan dari novel Pulang', '/placeholder.svg?height=60&width=45'),
('Hello', 'Tere Liye', 2021, '18+', 'Novel tentang persahabatan dan cinta', '/placeholder.svg?height=60&width=45')
ON CONFLICT DO NOTHING;
