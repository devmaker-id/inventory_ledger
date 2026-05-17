# EPISODE 9 — SALES SYSTEM + SALES LEDGER + REPORTING API

## 📌 Project
Seller Backend API

---

# 🎯 Tujuan Episode 9

Pada episode ini backend berhasil berkembang dari:

```text
Inventory Distribution System
```

menjadi:

```text
Sales & Revenue System
```

Backend sekarang mampu:

- mencatat penjualan voucher
- mengurangi stok retail otomatis
- menyimpan histori sales
- menghitung revenue
- membuat sales summary
- pagination sales history
- filtering sales
- reporting API
- financial movement ledger

---

# 🧠 Konsep Besar Episode 9

Pada episode sebelumnya:

```text
stok hanya berpindah antar user
```

Namun sekarang:

```text
stok keluar dari inventory karena terjual
```

Artinya:

```text
Inventory
↓
Sales
↓
Revenue
↓
Reporting
```

Backend mulai memasuki:
- transaction system
- financial reporting
- operational analytics

---

# 🚀 Fitur Yang Berhasil Dibangun

| Feature | Status |
|---|---|
| Sales API | ✅ |
| Reduce Stock on Sale | ✅ |
| Sales Ledger | ✅ |
| Revenue Tracking | ✅ |
| Sales Summary API | ✅ |
| Sales History API | ✅ |
| Pagination | ✅ |
| Search Filter | ✅ |
| Product Filter | ✅ |
| Date Filter | ✅ |
| Prisma Aggregate | ✅ |

---

# 🧠 Perubahan Database

## Update Model StockMovements

Field baru:

```prisma
salePrice Int?

totalPrice Int?
```

---

# 🧠 Tujuan

Digunakan untuk:

- menyimpan harga jual
- menyimpan total transaksi
- laporan revenue
- analytics
- settlement system nanti

---

# 📄 Final Schema StockMovements

```prisma
model StockMovements {

  id Int @id @default(autoincrement())

  fromUserId Int?

  toUserId Int?

  productId Int

  qty Int

  salePrice Int?

  totalPrice Int?

  type String

  note String?

  createdAt DateTime @default(now())

  fromUser Users? @relation(
    "FromUser",
    fields: [fromUserId],
    references: [id]
  )

  toUser Users? @relation(
    "ToUser",
    fields: [toUserId],
    references: [id]
  )

  product Products @relation(
    fields: [productId],
    references: [id]
  )

  @@index([fromUserId])

  @@index([toUserId])

  @@index([productId])

  @@index([type])
}
```

---

# 🚀 Migration Database

```bash
npx prisma db push
```

---

# Generate Prisma Client

```bash
npx prisma generate
```

---

# 📁 Struktur Folder Episode 9

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
└── config/
```

---

# 🧠 Flow Sales System

```text
Retail Login
    ↓
POST /api/stocks/sale
    ↓
Validate Stock
    ↓
Reduce UserStocks
    ↓
Create SALE Movement
    ↓
Save Revenue
    ↓
Success Response
```

---

# 🔐 Security & Role

| Endpoint | OWNER | DIST | RETAIL |
|---|---|---|---|
| /sale | ❌ | ❌ | ✅ |
| /sales | ✅ | ✅ | ❌ |
| /sales-summary | ✅ | ✅ | ❌ |

---

# 🧠 Kenapa Retail Only?

Karena dalam bisnis:

```text
Retail → pelanggan akhir
```

Retail adalah role yang menjual voucher langsung.

---

# 🚀 API ENDPOINTS EPISODE 9

---

# 💰 1. SALE STOCK API

## Endpoint

```http
POST /api/stocks/sale
```

---

## Fungsi

Digunakan untuk:
- penjualan voucher
- pengurangan stok retail
- pencatatan revenue
- histori sales

---

## Headers

```http
Authorization: Bearer TOKEN
Content-Type: application/json
```

---

## Request Body

```json
{
  "productId": 1,
  "qty": 5,
  "salePrice": 2000,
  "note": "Penjualan harian"
}
```

---

# 🧠 Penjelasan Body

| Field | Fungsi |
|---|---|
| productId | voucher/product |
| qty | jumlah terjual |
| salePrice | harga jual retail |
| note | catatan penjualan |

---

# 🧠 Yang Terjadi di Backend

```text
Retail Stock -5
↓
Create SALE Movement
↓
Save Revenue
↓
Success
```

---

## Response Success

```json
{
  "success": true,
  "message": "Sale success"
}
```

---

# 📊 2. SALES SUMMARY API

## Endpoint

```http
GET /api/stocks/sales-summary
```

---

## Fungsi

Digunakan untuk:
- dashboard owner
- dashboard distributor
- analytics
- laporan revenue

---

## Response Success

```json
{
  "success": true,

  "data": {

    "totalTransactions": 5,

    "totalQty": 20,

    "totalRevenue": 40000
  }
}
```

---

# 🧠 Data Yang Dihitung

| Field | Fungsi |
|---|---|
| totalTransactions | jumlah transaksi |
| totalQty | total voucher terjual |
| totalRevenue | total omzet |

---

# 🧠 Prisma Aggregate

Sales summary menggunakan:

```ts
prisma.stockMovements.aggregate()
```

Tujuannya:
- optimasi query
- hitung langsung di database
- lebih cepat & efisien

---

# 📜 3. SALES HISTORY API

## Endpoint

```http
GET /api/stocks/sales
```

---

# 🚀 Features

API ini mendukung:

- pagination
- search
- product filter
- date filter

---

# 🧪 Pagination Example

```http
GET /api/stocks/sales?page=1&limit=10
```

---

# 🔍 Search Example

```http
GET /api/stocks/sales?search=cicaheum
```

---

# 📦 Product Filter Example

```http
GET /api/stocks/sales?productId=1
```

---

# 📅 Date Filter Example

```http
GET /api/stocks/sales?startDate=2026-01-01&endDate=2026-12-31
```

---

# 🧠 Search System

Search menggunakan:

```ts
contains
mode: "insensitive"
```

Artinya:
search tidak peduli huruf besar kecil.

---

# 🧠 Date Filter

Digunakan untuk:
- laporan harian
- laporan bulanan
- settlement period
- analytics

---

# 🧠 Pagination

Menggunakan:

```ts
skip
take
```

Tujuan:
- optimasi query database
- mempercepat frontend table
- scalable API

---

# 📄 Response Sales History

```json
{
  "success": true,

  "data": [

    {
      "id": 10,

      "qty": 5,

      "salePrice": 2000,

      "totalPrice": 10000,

      "type": "SALE",

      "note": "Penjualan harian",

      "fromUser": {
        "name": "Retail Cicaheum"
      },

      "product": {
        "name": "Voucher 2000"
      }
    }
  ],

  "pagination": {

    "total": 50,

    "page": 1,

    "limit": 10,

    "totalPages": 5
  }
}
```

---

# 🧠 Ledger Architecture

Semua transaksi sales tetap menggunakan:

```text
StockMovements
```

Artinya:

- DISTRIBUTION
- RETURN
- ADJUSTMENT
- SALE

semuanya hidup di:
- satu transaction ledger
- satu histori movement
- satu audit system

---

# 🧠 Kenapa Tidak Membuat Table Sales?

Karena:

```text
SALE = movement keluar inventory
```

Dan architecture ledger sekarang sudah cukup kuat.

Keuntungan:
- lebih sederhana
- lebih konsisten
- lebih scalable
- lebih mudah audit

---

# 🧠 Atomic Transaction

Sales menggunakan:

```ts
prisma.$transaction()
```

Tujuannya:
- menghindari stock corruption
- menghindari partial update
- menjaga integritas inventory

---

# 🧠 Contoh Kasus

```text
Reduce Stock
↓
Create Sale Movement
↓
Save Revenue
```

Jika salah satu gagal:

```text
ROLLBACK
```

---

# 🧠 Testing Yang Disarankan

---

# ✅ Retail Sale Test

```text
Retail jual voucher
```

Pastikan:
- stock berkurang
- movement SALE tercatat
- revenue tersimpan

---

# ✅ Sales Summary Test

Pastikan:
- total revenue benar
- total qty benar
- total transaction benar

---

# ✅ Pagination Test

```http
?page=1&limit=5
```

---

# ✅ Search Test

```http
?search=retail
```

---

# ✅ Product Filter Test

```http
?productId=1
```

---

# ✅ Date Filter Test

```http
?startDate=2026-01-01
```

---

# ❌ Insufficient Stock Test

Pastikan sistem menolak:

```text
qty > stock available
```

---

# ❌ Unauthorized Test

Pastikan:
- distributor tidak bisa sale
- retail tidak bisa sales-summary

---

# 🚀 Hasil Episode 9

Backend sekarang berhasil memiliki:

- sales system
- revenue tracking
- sales history
- sales summary
- financial movement
- pagination API
- filtering API
- dashboard-ready endpoint
- reporting API
- transaction ledger

---

# 📌 Persiapan Episode 10

Next:
- Settlement System
- Profit Sharing
- Revenue Distribution
- Distributor Reports
- Retail Reports
- Dashboard Analytics
- Chart API
- Daily Reports
- Monthly Reports

---

# 🎯 Status Project Saat Ini

```text
Authentication System Complete ✅
User Management Complete ✅
Inventory Distribution Complete ✅
Inventory Ledger Complete ✅
Sales System Complete ✅
Revenue Reporting Complete ✅
Dashboard API Ready ✅

Next: Settlement & Analytics System 🚀
```

---

# 🧠 Kesimpulan Episode 9

Pada episode ini backend berhasil berubah dari:

```text
Inventory Backend
```

menjadi:

```text
Inventory + Financial Reporting Backend
```

Dengan adanya:
- sales ledger
- revenue tracking
- reporting API
- pagination
- filtering
- summary analytics

backend sekarang jauh lebih siap digunakan untuk:
- dashboard frontend
- analytics system
- operational monitoring
- settlement reporting
- business intelligence
- scalable transaction system

