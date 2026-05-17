# EPISODE 3 — AUTH SYSTEM + TYPESCRIPT + CLEAN ARCHITECTURE
```prisma
createdAt: 14, Mei 2026
developer: Devmaker-id
```
## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 3

Pada episode ini project backend mulai naik level dari:
- backend sederhana
- menjadi backend modern dengan:
  - TypeScript
  - ESM
  - Prisma ORM
  - JWT Authentication
  - Clean Architecture
  - Multi Role System

---

# 🚀 Stack Yang Digunakan

| Module | Fungsi |
|---|---|
| Node.js | Runtime JavaScript |
| Express | HTTP Server |
| PostgreSQL | Database |
| Prisma ORM | ORM database modern |
| TypeScript | Type Safety |
| TSX | Runtime TypeScript |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Thunder Client | API Testing |

---

# 📦 Package Yang Digunakan

## Dependencies

```bash
npm install express dotenv bcrypt jsonwebtoken @prisma/client
```

## Dev Dependencies

```bash
npm install -D prisma typescript tsx
npm install -D @types/node
npm install -D @types/express
npm install -D @types/bcrypt
npm install -D @types/jsonwebtoken
```

---

# 🧠 Penjelasan Dependencies

| Package | Fungsi |
|---|---|
| express | Framework backend |
| dotenv | Membaca file .env |
| bcrypt | Hash password |
| jsonwebtoken | Generate JWT token |
| @prisma/client | Prisma runtime client |
| prisma | Prisma CLI |
| tsx | Menjalankan TypeScript langsung |
| typescript | Type checker |
| @types/* | Type definition TypeScript |

---

# ⚙️ Konsep Penting Yang Dipelajari

## 1. ESM (ES Modules)

Project menggunakan:

```json
"type": "module"
```

Artinya:
- menggunakan import/export modern
- bukan require/module.exports

---

## 2. TypeScript + ESM

Rule penting:

### File:
```text
pakai .ts
```

### Import:
```text
tetap pakai .js
```

Contoh:

```ts
import prisma from "../config/prisma.js";
```

Walaupun file aslinya:

```text
prisma.ts
```

---

# 📁 Struktur Folder Final Episode 3

```bash
seller-backend/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed/
│   │   ├── index.ts
│   │   ├── role.seed.ts
│   │   └── user.seed.ts
│   └── migrations/
│
├── src/
│
│   ├── config/
│   │   └── prisma.ts
│
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.utils.ts
│   │   └── auth.types.ts
│
│   ├── middlewares/
│   │   └── (next episode)
│
│   ├── app.ts
│   └── server.ts
│
├── .env
├── package.json
├── tsconfig.json
└── prisma.config.ts
```

---

# 🔐 AUTH SYSTEM

## Features:
- login
- bcrypt password
- JWT token
- role system

---

# 📌 Role Yang Digunakan

| Role | Fungsi |
|---|---|
| OWNER | Full access |
| DISTRIBUTOR | Distributor access |
| RETAIL | Retail access |

---

# 🔑 Environment Variable

```env
PORT=3000

DATABASE_URL="postgresql://..."

JWT_SECRET="supersecret"
JWT_EXPIRES_IN="1d"
```

---

# 🧪 Testing API

Menggunakan Thunder Client di Visual Studio Code.

## Endpoint Login

```http
POST /auth/login
```

## Request Body

```json
{
  "email": "owner@test.com",
  "password": "123456"
}
```

---

# 🚀 Hasil Episode 3

## Backend berhasil:
- menggunakan TypeScript
- menggunakan ESM
- menggunakan Prisma ORM
- login JWT
- multi role database
- clean folder structure
- modular seed
- modern backend architecture

---

# 📌 Persiapan Episode 4

Next:
- JWT Middleware
- Role Middleware
- Protected Routes
- Register API
- Validation Layer
- CRUD User

---

# 🎯 Status Project Saat Ini

```text
Backend Foundation Complete ✅
```
