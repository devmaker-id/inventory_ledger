# 📦 Seller Backend — Episode 1 (Prisma + PostgreSQL Setup)
```prisma
createdAt: 10, Mei 2026
developer: Devmaker-id
```
Backend project ini dibuat sebagai latihan sistem penjualan seller/agen menggunakan Node.js + Prisma + PostgreSQL.

---

# 🚀 Tech Stack

- Node.js: **v24.x**
- npm: **v11.6.x**
- PostgreSQL: **16+**
- Prisma ORM: **v6.x**
- OS: macOS 12.x

---

# 🎯 Tujuan Episode 1

- Setup PostgreSQL di local
- Setup user & permission database
- Setup Prisma ORM
- Membuat migration pertama
- Menjalankan Prisma Studio (GUI database)
- Membuat struktur project yang rapi

---

# 📁 Struktur Project

```txt
seller-backend/
├── prisma/
│   ├── schema.prisma        # semua model database
│   └── migrations/          # history perubahan database
│
├── src/
│   ├── index.js             # entry point nodejs
│   └── db/
│       └── prisma.js        # prisma client instance (opsional)
│
├── .env                     # database credentials
├── package.json
└── node_modules/
```

---
# ⚙️ Instalasi Project
- npm init -y
- npm install express pg
- npm install prisma @prisma/client
- npx prisma init
---
# 🧾 Environment (.env)
```txt
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seller_app
DB_USER=seller_api
DB_PASSWORD=password123

DATABASE_URL="postgresql://seller_api:password123@localhost:5432/seller_app"
```

# modeling
- prisma/schema.prisma
```txt
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

# 🔄 Migration Database
- npx prisma migrate dev --name episode-1

# 📊 Prisma Studio (GUI)
- npx prisma studio