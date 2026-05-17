# EPISODE 6 — CRUD USERS + PAGINATION + SECURITY

## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 6

Pada episode ini backend berhasil memiliki:

- GET all users API
- GET detail user API
- UPDATE user API
- DELETE user API
- pagination system
- search user by name/email
- filtering query parameter
- JWT authentication
- protected routes
- role authorization (RBAC)
- admin access filtering

Backend sekarang sudah siap digunakan untuk:

- dashboard admin
- seller dashboard
- mobile app
- frontend table system
- user management
- secure API access

---

# 🚀 Materi Yang Dipelajari

| Materi | Fungsi |
|---|---|
| CRUD User | Operasi data user |
| Pagination | Membatasi data |
| Search API | Cari data user |
| Query Params | Filtering URL |
| JWT Authentication | Login security |
| Protected Route | Membatasi akses |
| RBAC Authorization | Filter role |
| Prisma ORM | Query database modern |
| Service Layer | Business logic |
| Middleware | Validasi request |

---

# 📁 Struktur Folder Episode 6

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
├── users/
│   ├── users.controller.ts
│   ├── users.routes.ts
│   ├── users.service.ts
│   └── users.types.ts
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

# 🧠 Flow User Management + Security

```text
Client
  ↓
Authorization: Bearer TOKEN
  ↓
verifyToken Middleware
  ↓
JWT Verification
  ↓
req.user
  ↓
authorizeRoles Middleware
  ↓
Controller
  ↓
Service
  ↓
Prisma ORM
  ↓
Database
  ↓
Response JSON
```

---

# 📄 File: users.types.ts

## Lokasi

```bash
src/users/users.types.ts
```

---

## Isi File

```ts
export interface UserQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface UpdateUserBody {
  name?: string;
  phone?: string;
  address?: string;
}
```

---

# 🧠 Penjelasan users.types

Digunakan untuk:
- type safety
- validasi query parameter
- struktur request body
- menghindari any
- mempermudah maintenance

---

# 📄 File: users.service.ts

## Lokasi

```bash
src/users/users.service.ts
```

---

# 🚀 GET USERS SERVICE

```ts
export const getUsersService = async (
  query: UserQuery
) => {

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const search = query.search || "";

  const users = await prisma.users.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    skip,
    take: limit,

    include: {
      role: true,
    },

    orderBy: {
      id: "desc",
    },
  });

  const total = await prisma.users.count({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return {
    data: users,

    pagination: {
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};
```

---

# 🧠 Penjelasan GET USERS

## Pagination

```ts
skip
take
```

Digunakan untuk:
- membatasi data
- optimasi query database
- mempercepat frontend table

---

## Search User

```ts
contains
```

Digunakan untuk:
- mencari nama user
- mencari email user

---

## Case Insensitive

```ts
mode: "insensitive"
```

Search tidak peduli huruf besar kecil.

Contoh:
- admin
- ADMIN
- Admin

Semua tetap terbaca.

---

# 🚀 GET DETAIL USER SERVICE

```ts
export const getUserByIdService = async (
  id: number
) => {

  const user = await prisma.users.findUnique({
    where: {
      id,
    },

    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
```

---

# 🚀 UPDATE USER SERVICE

```ts
export const updateUserService = async (
  id: number,
  body: UpdateUserBody
) => {

  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.users.update({
    where: { id },

    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
    },
  });

  return updatedUser;
};
```

---

# 🚀 DELETE USER SERVICE

```ts
export const deleteUserService = async (
  id: number
) => {

  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.users.delete({
    where: { id },
  });

  return true;
};
```

---

# 🔐 AUTH MIDDLEWARE

## Lokasi

```bash
src/middlewares/auth.middleware.ts
```

---

## Fungsi

Middleware ini digunakan untuk:
- membaca JWT token
- verify token
- memastikan user login
- menyimpan user ke req.user

---

## Isi File

```ts
import {
  NextFunction,
  Request,
  Response,
} from "express";

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
    const authHeader =
      req.headers.authorization;

    // 2. cek apakah header ada
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**
     * format:
     * Bearer TOKEN
     */
    const token =
      authHeader.split(" ")[1];

    // 3. cek token
    if (!token) {
      return res.status(401).json({
        success: false,
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
      success: false,
      message: "Invalid token",
    });
  }
};
```

---

# 🔐 ROLE MIDDLEWARE

## Lokasi

```bash
src/middlewares/role.middleware.ts
```

---

## Fungsi

Digunakan untuk:
- membatasi akses role
- admin only route
- seller only route
- RBAC authorization

---

## Isi File

```ts
import {
  NextFunction,
  Request,
  Response,
} from "express";

/**
 * AUTHORIZE ROLE
 */
export const authorizeRoles = (
  ...roles: string[]
) => {

  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    // 1. cek user login
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. cek role
    if (
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 3. next
    next();
  };
};
```

---

# 📄 File: express.d.ts

## Lokasi

```bash
src/types/express.d.ts
```

---

## Isi File

```ts
declare namespace Express {
  export interface Request {
    user?: {
      userId: number;
      email: string;
      role: string;
    };
  }
}
```

---

# 🧠 Penjelasan express.d.ts

Digunakan agar TypeScript mengenali:

```ts
req.user
```

Tanpa file ini biasanya muncul error:

```text
Property 'user' does not exist
```

---

# 📄 File: users.routes.ts

## Lokasi

```bash
src/users/users.routes.ts
```

---

# 🚀 FINAL VERSION

```ts
import { Router } from "express";

import {
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from "./users.controller.js";

import {
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

const router = Router();

/**
 * PROTECT ALL ROUTES
 */
router.use(verifyToken);

/**
 * SUPER ADMIN ONLY
 */
router.use(
  authorizeRoles("SUPER_ADMIN")
);

/**
 * GET USERS
 */
router.get(
  "/",
  getUsersController
);

/**
 * GET USER DETAIL
 */
router.get(
  "/:id",
  getUserByIdController
);

/**
 * UPDATE USER
 */
router.put(
  "/:id",
  updateUserController
);

/**
 * DELETE USER
 */
router.delete(
  "/:id",
  deleteUserController
);

export default router;
```

---

# 🧪 TESTING SECURITY

# ❌ Tanpa Token

```bash
curl http://localhost:3000/users
```

---

# ✅ Response

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# ❌ Seller Access

```bash
curl \
-H "Authorization: Bearer SELLER_TOKEN" \
http://localhost:3000/users
```

---

# ✅ Response

```json
{
  "success": false,
  "message": "Access denied"
}
```

---

# ✅ SUPER_ADMIN Access

```bash
curl \
-H "Authorization: Bearer ADMIN_TOKEN" \
http://localhost:3000/users
```

---

# ✅ Response

```json
{
  "success": true,
  "data": []
}
```

---

# 🧠 Konsep Besar Episode 6

| Konsep | Penjelasan |
|---|---|
| CRUD API | Operasi data |
| Pagination | Optimasi data besar |
| Search Query | Dynamic filter |
| Query Params | Filter URL |
| JWT Auth | Authentication |
| Protected Route | Security endpoint |
| RBAC | Role access control |
| Middleware | Validasi request |
| Prisma ORM | Database modern |
| Service Layer | Business logic |

---

# 🚀 Hasil Episode 6

Backend berhasil:
- CRUD user lengkap
- pagination system
- search user
- protected routes
- JWT verification
- role authorization
- admin filtering
- secure API architecture
- scalable backend structure

---

# 📌 Persiapan Episode 7

Next:
- Product CRUD
- Category CRUD
- Upload Image
- Product Stock
- Seller Ownership
- Product Relation

---

# 🎯 Status Project Saat Ini

```text
Authentication System Complete ✅
User Management Complete ✅
Security Middleware Complete ✅
Next: Product Management System 🚀
```

