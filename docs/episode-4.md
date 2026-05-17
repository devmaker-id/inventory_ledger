# EPISODE 4 — JWT MIDDLEWARE + ROLE AUTHORIZATION

## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 4

Pada episode ini backend mulai memiliki:
- protected route
- JWT verification
- role authorization
- RBAC (Role Based Access Control)

Backend sekarang sudah bisa:
- mengenali user login
- membaca token
- membatasi akses berdasarkan role

---

# 🚀 Materi Yang Dipelajari

| Materi | Fungsi |
|---|---|
| JWT Middleware | Verifikasi token |
| Authorization | Pembatasan role |
| RBAC | Role Based Access Control |
| Express Middleware | Proteksi route |
| Request Extension | Menambah req.user |
| Bearer Token | Standar authentication API |

---

# 📁 Struktur Folder Episode 4

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

# 🧠 Konsep Besar Episode 4

## Flow Authentication + Authorization

```text
Client
  ↓
Login
  ↓
JWT Token
  ↓
Protected Route
  ↓
verifyToken Middleware
  ↓
req.user
  ↓
authorizeRoles Middleware
  ↓
Controller
```

---

# 📄 File: express.d.ts

## Lokasi

```bash
src/types/express.d.ts
```

## Isi File

```ts
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}
```

---

# 🧠 Fungsi express.d.ts

Supaya TypeScript mengenali:

```ts
req.user
```

Tanpa file ini akan muncul error:

```text
Property 'user' does not exist on type Request
```

---

# 📄 File: auth.middleware.ts

## Lokasi

```bash
src/middlewares/auth.middleware.ts
```

---

## Isi File

```ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

/**
 * VERIFY JWT TOKEN
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    // 1. ambil authorization header
    const authHeader = req.headers.authorization;

    // 2. cek header
    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    /**
     * format:
     * Bearer TOKEN
     */
    const token = authHeader.split(" ")[1];

    // 3. cek token
    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    // 4. verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: number;
      email: string;
      role: string;
    };

    // 5. simpan user ke request
    req.user = decoded;

    // 6. lanjut
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
```

---

# 🧠 Penjelasan auth.middleware

## verifyToken()

Tugas:
- membaca bearer token
- verify JWT
- mengambil payload
- menyimpan user ke req.user

---

# 📄 File: role.middleware.ts

## Lokasi

```bash
src/middlewares/role.middleware.ts
```

---

## Isi File

```ts
import { NextFunction, Request, Response } from "express";

/**
 * AUTHORIZE ROLE
 */
export const authorizeRoles = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    // 1. cek login
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2. cek role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // 3. lanjut
    next();
  };
};
```

---

# 🧠 Penjelasan role.middleware

## authorizeRoles()

Digunakan untuk membatasi role.

Contoh:

```ts
authorizeRoles("OWNER")
```

atau:

```ts
authorizeRoles("OWNER", "DISTRIBUTOR")
```

---

# 📄 Update auth.routes.ts

## Lokasi

```bash
src/auth/auth.routes.ts
```

---

## Isi File

```ts
import { Router } from "express";

import { loginController } from "./auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * LOGIN
 */
router.post("/login", loginController);

/**
 * PROFILE
 * semua user login boleh akses
 */
router.get(
  "/profile",
  verifyToken,
  (req, res) => {
    return res.json({
      message: "Profile success",
      user: req.user,
    });
  }
);

/**
 * OWNER ONLY
 */
router.get(
  "/admin",
  verifyToken,
  authorizeRoles("OWNER"),
  (req, res) => {
    return res.json({
      message: "Welcome OWNER",
      user: req.user,
    });
  }
);

/**
 * OWNER + DISTRIBUTOR
 */
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("OWNER", "DISTRIBUTOR"),
  (req, res) => {
    return res.json({
      message: "Dashboard access success",
      user: req.user,
    });
  }
);

export default router;
```

---

# 🧪 TESTING THUNDER CLIENT

## 1. Login

### Endpoint

```http
POST http://localhost:3000/auth/login
```

### Body

```json
{
  "email": "owner@test.com",
  "password": "123456"
}
```

---

## 2. Copy JWT Token

Response:

```json
{
  "token": "eyJhbGci..."
}
```

---

## 3. Test Protected Route

### Endpoint

```http
GET http://localhost:3000/auth/profile
```

### Header

```http
Authorization: Bearer TOKEN_KAMU
```

---

# ✅ Hasil Success

```json
{
  "message": "Profile success",
  "user": {
    "userId": 1,
    "email": "owner@test.com",
    "role": "OWNER"
  }
}
```

---

# ❌ Test Tanpa Token

Response:

```json
{
  "message": "Unauthorized"
}
```

---

# ❌ Test Token Invalid

Response:

```json
{
  "message": "Invalid token"
}
```

---

# ❌ Test Role Salah

Contoh:
- login sebagai RETAIL
- akses /admin

Response:

```json
{
  "message": "Access denied"
}
```

---

# 🔥 Konsep RBAC

RBAC = Role Based Access Control

Digunakan untuk:
- admin dashboard
- ERP
- marketplace
- SaaS
- enterprise backend

---

# 🧠 Pelajaran Besar Episode 4

| Konsep | Level |
|---|---|
| JWT Authentication | Intermediate |
| Authorization | Intermediate |
| RBAC | Advanced Basic |
| Middleware Chain | Intermediate |
| Request Extension | Intermediate |
| Protected Route | Intermediate |

---

# 🚀 Hasil Episode 4

Backend berhasil:
- membaca JWT
- verify token
- membuat protected route
- membuat role authorization
- menerapkan RBAC
- menggunakan middleware Express modern

---

# 📌 Persiapan Episode 5

Next:
- Register API
- User Validation
- Create User Service
- Assign Role
- Response Standardization

---

# 🎯 Status Project Saat Ini

```text
Protected API Complete ✅
```
