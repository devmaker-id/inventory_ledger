# EPISODE 5 — REGISTER API + USER CREATION

## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 5

Pada episode ini backend berhasil memiliki:
- register API
- create user system
- password hashing
- duplicate email validation
- role assignment
- auto login setelah register

Backend sekarang sudah siap dipakai:
- frontend
- mobile app
- dashboard admin

---

# 🚀 Materi Yang Dipelajari

| Materi | Fungsi |
|---|---|
| Register API | Membuat user baru |
| Validation Logic | Validasi data input |
| Duplicate Check | Cek email unik |
| Password Hashing | Keamanan password |
| DTO Pattern | Struktur request body |
| JWT Auto Login | Langsung login setelah register |
| Response Standardization | Format response konsisten |

---

# 📁 Struktur Folder Episode 5

```bash
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.routes.ts
│   ├── auth.service.ts
│   ├── auth.types.ts
│   └── auth.utils.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── role.middleware.ts
│
├── types/
│   └── express.d.ts
│
├── config/
│   └── prisma.ts
│
├── app.ts
└── server.ts
```

---

# 🧠 Flow Register System

```text
Client
  ↓
POST /auth/register
  ↓
Controller
  ↓
Service
  ↓
Validation
  ↓
Check Email
  ↓
Hash Password
  ↓
Find Role
  ↓
Create User
  ↓
Generate JWT
  ↓
Response
```

---

# 📄 File: auth.types.ts

## Lokasi

```bash
src/auth/auth.types.ts
```

---

## Isi File

```ts
export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;

  phone?: string;
  address?: string;

  role?: string;
}
```

---

# 🧠 Penjelasan auth.types

TypeScript interface digunakan untuk:
- memastikan struktur request body
- menghindari any
- mempermudah maintenance
- meningkatkan type safety

---

# 📄 Update auth.service.ts

## Lokasi

```bash
src/auth/auth.service.ts
```

---

## Tambahkan Import

```ts
import prisma from "../config/prisma.js";

import {
  comparePassword,
  generateToken,
  hashPassword,
} from "./auth.utils.js";

import {
  LoginBody,
  RegisterBody,
} from "./auth.types.js";
```

---

# 🚀 REGISTER SERVICE

## Tambahkan Function

```ts
/**
 * REGISTER SERVICE
 */
export const registerService = async (
  data: RegisterBody
) => {

  // 1. cek email sudah ada atau belum
  const existingUser = await prisma.users.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // 2. cari role
  const roleName = data.role || "RETAIL";

  const role = await prisma.role.findFirst({
    where: {
      name: roleName,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  // 3. hash password
  const hashedPassword = await hashPassword(
    data.password
  );

  // 4. create user
  const user = await prisma.users.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,

      phone: data.phone,
      address: data.address,

      roleId: role.id,
    },

    include: {
      role: true,
    },
  });

  // 5. generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });

  // 6. return response
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    },

    token,
  };
};
```

---

# 🧠 Penjelasan registerService

## 1. Check Duplicate Email

```ts
findUnique()
```

Digunakan untuk memastikan email belum terdaftar.

---

## 2. Default Role

```ts
RETAIL
```

Jika role tidak dikirim,
otomatis menjadi RETAIL.

---

## 3. Hash Password

```ts
bcrypt.hash()
```

Password asli tidak disimpan ke database.

---

## 4. Create User

```ts
prisma.users.create()
```

Menyimpan user ke PostgreSQL melalui Prisma ORM.

---

## 5. Generate JWT

User langsung mendapatkan token login setelah register.

---

# 📄 Update auth.controller.ts

## Lokasi

```bash
src/auth/auth.controller.ts
```

---

## Tambahkan Import

```ts
import { Request, Response } from "express";

import {
  loginService,
  registerService,
} from "./auth.service.js";

import {
  LoginBody,
  RegisterBody,
} from "./auth.types.js";
```

---

# 🚀 REGISTER CONTROLLER

```ts
/**
 * REGISTER CONTROLLER
 */
export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {

    // 1. ambil body request
    const body = req.body;

    // 2. register user
    const result = await registerService(body);

    // 3. response success
    return res.status(201).json({
      success: true,
      message: "Register success",
      data: result,
    });

  } catch (error) {

    // 4. response error
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Register failed",
    });
  }
};
```

---

# 🧠 Penjelasan registerController

Controller bertugas:
- menerima request
- mengirim data ke service
- mengembalikan response

Business logic tetap berada di service layer.

---

# 📄 Update auth.routes.ts

## Lokasi

```bash
src/auth/auth.routes.ts
```

---

## Update Import

```ts
import {
  loginController,
  registerController,
} from "./auth.controller.js";
```

---

# 🚀 Tambahkan Route Register

```ts
/**
 * REGISTER
 */
router.post(
  "/register",
  registerController
);
```

---

# 🧪 TESTING THUNDER CLIENT

---

# 🥇 Register User Baru

## Endpoint

```http
POST http://localhost:3000/auth/register
```

---

## Request Body

```json
{
  "name": "Retail Baru",
  "email": "retailbaru@test.com",
  "password": "123456"
}
```

---

# ✅ Response Success

```json
{
  "success": true,
  "message": "Register success",
  "data": {
    "user": {
      "id": 4,
      "name": "Retail Baru",
      "email": "retailbaru@test.com",
      "role": "RETAIL"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

# ❌ Test Duplicate Email

Coba register menggunakan email yang sama.

---

# ❌ Response Error

```json
{
  "success": false,
  "message": "Email already registered"
}
```

---

# 🔐 Security Yang Sudah Dimiliki

Backend sekarang sudah memiliki:
- bcrypt password hashing
- JWT authentication
- protected route
- RBAC authorization
- duplicate validation

---

# 🧠 Konsep Besar Episode 5

| Konsep | Penjelasan |
|---|---|
| DTO Pattern | Struktur data request |
| Service Layer | Business logic |
| Controller Layer | HTTP handler |
| JWT Auto Login | UX modern |
| Validation Logic | Cegah data invalid |
| Prisma ORM | Query database modern |

---

# 🚀 Hasil Episode 5

Backend berhasil:
- membuat register API
- membuat user baru
- validasi duplicate email
- hash password otomatis
- generate JWT otomatis
- assign default role
- membuat response standard

---

# 📌 Persiapan Episode 6

Next:
- CRUD Users
- Pagination
- Search User
- Filter User
- Update User
- Delete User

---

# 🎯 Status Project Saat Ini

```text
User Registration Complete ✅
```
