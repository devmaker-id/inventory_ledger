# 📦 Seller Backend API
```prisma
createdAt: 13, Mei 2026
developer: Devmaker-id
```
## Episode 2 — Prisma Role System (Users & Role Relation)

---

## 🧠 Module Overview

Module ini adalah fondasi authentication & authorization system untuk backend **Seller Platform**.

Di episode ini, kita membangun:

- User management system
- Role-based access control (RBAC)
- Database design menggunakan Prisma + PostgreSQL
- Seed data awal untuk role system

---

## ⚙️ Tech Stack

- Node.js (v18+ recommended)
- Prisma ORM v6.19.3
- PostgreSQL 16
- TypeScript (TSX runtime for seed)
- Prisma Config v6 (prisma.config.ts)

---

## 🗂️ Database Structure

### 👤 Users Table

Menyimpan data user aplikasi.

```prisma
model Users {
  id        Int      @id @default(autoincrement())

  name      String
  email     String   @unique
  password  String

  phone     String?  @unique
  address   String?

  roleId    Int
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Restrict)

  isActive  Boolean  @default(true)
  lastLogin DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([roleId])
}
```

### 🛡️ Role Table
```prisma
model Role {
  id          Int     @id @default(autoincrement())
  name        String  @unique

  description String?
  level       Int?    // OWNER=1, DISTRIBUTOR=2, RETAIL=3

  users Users[]
}
```

### 🧩 Role List (Seeded Data)
role default yang sudah tersedia
```prisma
OWNER             Admin utama sistem
DISTRIBUTOR       Pengelola distribusi
RETAIL            User toko / penjual
```

## 🌱 Database Seed
seed digunakan untuk migrasi ke database
- prisma/seed.ts
```prisma
await prisma.role.createMany({
  data: [
    { name: "OWNER" },
    { name: "DISTRIBUTOR" },
    { name: "RETAIL" },
  ],
  skipDuplicates: true,
});
```
jalankan ```npx prisma db seed```

## ⚙️ Prisma Config (v6)
```prisma
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```