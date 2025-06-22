import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tulisify.com' },
    update: {},
    create: {
      email: 'admin@tulisify.com',
      name: 'Admin Tulisify',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123456', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@tulisify.com' },
    update: {},
    create: {
      email: 'user@tulisify.com',
      name: 'User Tulisify',
      password: userPassword,
      role: 'USER',
    },
  })

  // Create sample books
  const books = [
    {
      title: 'Pulang',
      author: 'Tere Liye',
      year: 2015,
      category: 'SU',
      description: 'Novel tentang perjalanan pulang ke kampung halaman',
      createdBy: admin.id,
    },
    {
      title: 'Pergi',
      author: 'Tere Liye',
      year: 2018,
      category: 'THIRTEEN_PLUS',
      description: 'Kelanjutan dari novel Pulang',
      createdBy: admin.id,
    },
    {
      title: 'Hujan',
      author: 'Tere Liye',
      year: 2016,
      category: 'SU',
      description: 'Novel tentang persahabatan dan cinta',
      createdBy: user.id,
    },
  ]

  for (const book of books) {
    await prisma.book.upsert({
      where: { title: book.title },
      update: {},
      create: book,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
