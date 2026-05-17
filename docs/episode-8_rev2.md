# EPISODE 8 — STOCK DISTRIBUTION SYSTEM + INVENTORY LEDGER

## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 8

Pada episode ini backend mengalami perubahan architecture besar.

Sebelumnya backend masih menggunakan:

```text
Products.stock
```

Namun pada sistem inventory nyata, pendekatan tersebut memiliki banyak kelemahan:

- sulit audit
- sulit tracking distribusi
- sulit retur
- sulit adjustment
- stock rawan corrupt
- tidak memiliki histori movement
- tidak scalable

Karena itu pada episode ini backend diubah menjadi:

```text
UserStocks
↓
StockMovements
```

Artinya:
- stok sekarang dimiliki oleh user
- setiap perpindahan stok tercatat
- seluruh perubahan inventory memiliki histori
- backend berubah menjadi inventory ledger system

---

# 🚀 Hasil Episode 8

Backend sekarang berhasil memiliki:

- transfer stock
- return stock
- stock adjustment
- stock ownership
- inventory ledger
- stock history
- my stock API
- atomic transaction
- audit inventory
- scalable inventory architecture

---

# 🧠 Konsep Besar Episode 8

| Konsep | Penjelasan |
|---|---|
| UserStocks | Menyimpan stok milik user |
| StockMovements | Histori perpindahan stok |
| Distribution | Distribusi stok |
| Return | Retur stok |
| Adjustment | Koreksi stok |
| Ledger | Audit inventory |
| Ownership | Kepemilikan stok |
| Atomic Transaction | Query aman & sinkron |
| RBAC | Hak akses role |
| Prisma Transaction | Menjaga integritas data |

---

# 🧱 Perubahan Database Architecture

## ❌ Sebelumnya

```text
Products.stock
```

Masalah:

- tidak tahu stok milik siapa
- tidak ada histori distribusi
- tidak bisa audit
- retur sulit
- stock mudah corrupt

---

## ✅ Sekarang

```text
Products
↓
UserStocks
↓
StockMovements
```

Artinya:

## Products
Sekarang hanya menjadi:

```text
Master Product / Master Voucher
```

Contoh:
- Voucher 2000
- Voucher 3000
- Voucher 5000

Products tidak lagi menyimpan:
- stock
- ownership

---

## UserStocks

Digunakan untuk:

- menyimpan stok user
- mengetahui ownership
- current balance inventory
- monitoring stok user

---

## StockMovements

Digunakan untuk:

- histori distribusi
- histori retur
- histori adjustment
- audit inventory
- tracking movement
- laporan inventory

---

# 📁 Struktur Folder Episode 8

```bash
src/
│
├── stocks/
│   ├── stocks.controller.ts
│   ├── stocks.routes.ts
│   ├── stocks.service.ts
│   ├── stocks.types.ts
│   └── stocks.validation.ts
│
├── auth/
├── users/
├── products/
├── categories/
├── middlewares/
├── config/
└── types/
```

---

# 🧠 Flow Stock Distribution System

```text
User Login
   ↓
JWT Verification
   ↓
Protected Route
   ↓
Stock Validation
   ↓
Prisma Transaction
   ↓
Update UserStocks
   ↓
Create StockMovements
   ↓
Response Success
```

---

# 🔐 Authentication & Security

Semua endpoint stocks menggunakan:

```http
Authorization: Bearer TOKEN
```

Dan menggunakan:

```ts
verifyToken
```

untuk memastikan user sudah login.

---

# 🔒 Role Authorization

Sistem menggunakan RBAC:

| Role | Akses |
|---|---|
| OWNER | Full access |
| DISTRIBUTOR | Transfer & Return |
| RETAIL | View stock only |

---

# 🚀 API ENDPOINTS EPISODE 8

---

# 📦 1. Transfer Stock API

## Endpoint

```http
POST /api/stocks/transfer
```

---

## Fungsi

Digunakan untuk:

- distribusi stok
- owner → distributor
- distributor → retail
- perpindahan ownership inventory

---

## Role Access

| Role | Access |
|---|---|
| OWNER | ✅ |
| DISTRIBUTOR | ✅ |
| RETAIL | ❌ |

---

## Request Headers

```http
Authorization: Bearer TOKEN
Content-Type: application/json
```

---

## Request Body

```json
{
  "toUserId": 2,
  "productId": 1,
  "qty": 100,
  "note": "Distribusi awal Bandung"
}
```

---

## Penjelasan Body

| Field | Fungsi |
|---|---|
| toUserId | penerima stok |
| productId | product/voucher |
| qty | jumlah stok |
| note | catatan distribusi |

---

## Response Success

```json
{
  "success": true,
  "message": "Stock transferred successfully"
}
```

---

## Yang Terjadi di Backend

```text
Sender Stock -100
↓
Receiver Stock +100
↓
Create Movement History
↓
Success
```

---

# 🔄 2. Return Stock API

## Endpoint

```http
POST /api/stocks/return
```

---

## Fungsi

Digunakan untuk:

- retur stok
- voucher tidak terjual
- stock kembali ke distributor
- stock kembali ke owner

---

## Role Access

| Role | Access |
|---|---|
| OWNER | ✅ |
| DISTRIBUTOR | ✅ |
| RETAIL | ❌ |

---

## Request Body

```json
{
  "toUserId": 1,
  "productId": 1,
  "qty": 10,
  "note": "Voucher tidak terjual"
}
```

---

## Response Success

```json
{
  "success": true,
  "message": "Stock returned successfully"
}
```

---

## Yang Terjadi di Backend

```text
Retail Stock -10
↓
Distributor Stock +10
↓
Create RETURN Movement
↓
Success
```

---

# ⚖️ 3. Stock Adjustment API

## Endpoint

```http
POST /api/stocks/adjustment
```

---

## Fungsi

Digunakan untuk:

- koreksi stok
- audit inventory
- kehilangan stok
- bonus stok
- stock mismatch
- penyesuaian manual

---

## Role Access

| Role | Access |
|---|---|
| OWNER | ✅ |
| DISTRIBUTOR | ❌ |
| RETAIL | ❌ |

---

## Request Body

```json
{
  "userId": 2,
  "productId": 1,
  "qty": -10,
  "note": "Audit stok fisik"
}
```

---

## Penjelasan Qty

| Qty | Fungsi |
|---|---|
| +10 | tambah stok |
| -10 | kurangi stok |

---

## Response Success

```json
{
  "success": true,
  "message": "Stock adjusted successfully"
}
```

---

## Yang Terjadi di Backend

```text
Distributor Stock -10
↓
Create ADJUSTMENT Movement
↓
Success
```

---

# 📦 4. Get My Stocks API

## Endpoint

```http
GET /api/stocks/me
```

---

## Fungsi

Digunakan untuk:

- melihat stok user login
- monitoring inventory
- dashboard stock
- current balance inventory

---

## Response Success

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "qty": 900,
      "product": {
        "id": 1,
        "name": "Voucher 2000",
        "basePrice": 1000
      }
    }
  ]
}
```

---

# 📜 5. Get Stock History API

## Endpoint

```http
GET /api/stocks/history
```

---

## Fungsi

Digunakan untuk melihat:

- histori distribusi
- histori retur
- histori adjustment
- histori movement inventory
- audit stock

---

## Response Success

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "qty": 100,
      "type": "DISTRIBUTION",
      "note": "Distribusi awal",

      "fromUser": {
        "name": "Main Owner"
      },

      "toUser": {
        "name": "Distributor Bandung"
      },

      "product": {
        "name": "Voucher 2000"
      }
    }
  ]
}
```

---

# 🧠 Atomic Transaction

Sistem menggunakan:

```ts
prisma.$transaction()
```

Tujuannya:

- menghindari stock corruption
- menghindari partial update
- menjaga integritas inventory
- memastikan seluruh query sinkron

---

## Contoh Kasus

```text
Stock Sender -100
Receiver +100
Movement Created
```

Jika salah satu gagal:

```text
ROLLBACK AUTOMATIS
```

Sehingga:
- stok tetap aman
- tidak ada ghost stock
- tidak ada half transaction

---

# 🧠 Inventory Ledger System

Semua perubahan stok sekarang tercatat di:

```text
StockMovements
```

---

## Jenis Movement

| Type | Fungsi |
|---|---|
| DISTRIBUTION | distribusi stok |
| RETURN | retur stok |
| ADJUSTMENT | koreksi stok |
| SALE | penjualan (next episode) |

---

# 🧠 Ownership System

Sekarang setiap stok memiliki owner.

Contoh:

```text
OWNER
 ↓
DISTRIBUTOR
 ↓
RETAIL
```

Artinya:
- stok tidak lagi global
- stok dimiliki user tertentu
- ownership tercatat jelas

---

# 🧠 Testing Yang Disarankan

## Transfer Test

```text
OWNER → DISTRIBUTOR
```

---

## Return Test

```text
RETAIL → DISTRIBUTOR
```

---

## Adjustment Test

```text
OWNER koreksi stok distributor
```

---

## Insufficient Stock Test

Pastikan sistem menolak:

```text
qty > stock available
```

---

## Unauthorized Test

Pastikan retail tidak bisa:

- transfer stock
- adjustment stock

---

# 🚀 Hasil Episode 8

Backend sekarang berhasil memiliki:

- inventory ledger system
- stock ownership
- stock distribution
- stock return
- stock adjustment
- audit history
- atomic transaction
- scalable architecture
- inventory tracking
- movement history

---

# 📌 Persiapan Episode 9

Next:

- Sales System
- Retail Sales API
- Sales History
- Settlement System
- Profit Sharing
- Revenue Reports
- Periodic Reports
- Dashboard Analytics
- Sales Ledger

---

# 🎯 Status Project Saat Ini

```text
Authentication System Complete ✅
User Management Complete ✅
Inventory Distribution System Complete ✅
Inventory Ledger Complete ✅
Atomic Transaction Complete ✅

Next: Sales & Settlement System 🚀
```

---

# 🧠 Kesimpulan Episode 8

Episode ini adalah perubahan architecture terbesar pada project.

Backend berubah dari:

```text
CRUD Product Backend
```

menjadi:

```text
Inventory Distribution Backend
```

Dengan adanya:

- stock ownership
- stock movement
- inventory ledger
- atomic transaction
- distribution flow
- adjustment system
- audit system

backend sekarang jauh lebih siap digunakan untuk:

- bisnis distribusi nyata
- inventory management
- audit stok
- laporan distribusi
- settlement system
- dashboard analytics
- scalable operational backend