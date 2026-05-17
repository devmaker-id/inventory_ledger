# 📦 Seller Backend

Backend system untuk aplikasi penjualan seller/agen menggunakan:

- Node.js (v24.x)
- Prisma ORM (v6.x)
- PostgreSQL (v16+)

Project ini dibuat sebagai pembelajaran backend modern dari dasar hingga production-ready structure.

---

# 🎯 Purpose

Project ini bertujuan untuk:

- Belajar backend Node.js dari nol
- Menggunakan Prisma sebagai ORM
- Mengelola database PostgreSQL
- Membangun sistem seller/agen (real-world use case)
- Menerapkan migration system yang benar

---

# 📁 Project Structure

```txt
seller-backend/
├── prisma/                 # Prisma schema & migrations
│   ├── schema.prisma
│   └── migrations/
│
├── src/                    # Source code backend
│   ├── index.js
│   └── db/
│       └── prisma.js
│
├── docs/                   # Dokumentasi lengkap
│   ├── 01-setup.md
│   ├── 02-database.md
│   ├── 03-api.md
│
├── .env                    # Environment variables
├── package.json
└── README.md