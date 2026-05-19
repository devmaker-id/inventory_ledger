# COMPLETE API ENDPOINT SUMMARY — INVENTORY LEDGER BACKEND

## 📌 Project
Inventory Ledger Backend API

---

# 🔐 AUTH MODULE

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | PUBLIC |
| POST | `/api/auth/login` | PUBLIC |
| GET | `/api/auth/profile` | AUTHENTICATED |

---

# 👥 USERS MODULE

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/users` | OWNER |
| GET | `/api/users/:id` | OWNER |
| PATCH | `/api/users/:id` | OWNER |
| DELETE | `/api/users/:id` | OWNER |

---

# 🗂️ CATEGORIES MODULE

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/categories` | OWNER |
| GET | `/api/categories` | AUTHENTICATED |
| GET | `/api/categories/:id` | AUTHENTICATED |
| PATCH | `/api/categories/:id` | OWNER |
| DELETE | `/api/categories/:id` | OWNER |

---

# 📦 PRODUCTS MODULE

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/products` | OWNER |
| GET | `/api/products` | AUTHENTICATED |
| GET | `/api/products/:id` | AUTHENTICATED |
| PATCH | `/api/products/:id` | OWNER / CREATOR |
| DELETE | `/api/products/:id` | OWNER / CREATOR |

---

# 📦 PRODUCTS QUERY SUPPORT

## GET /api/products

### Query Parameters

```http
?page=1
&limit=10
&search=voucher
&categoryId=1
```

---

# 📊 STOCKS MODULE

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/stocks/transfer` | OWNER, DISTRIBUTOR |
| GET | `/api/stocks/me` | OWNER, DISTRIBUTOR |
| GET | `/api/stocks/history` | OWNER, DISTRIBUTOR |
| POST | `/api/stocks/return` | OWNER, DISTRIBUTOR |
| POST | `/api/stocks/adjustment` | OWNER |
| POST | `/api/stocks/sale` | RETAIL |

---

# 🚚 STOCK TRANSFER

## Endpoint

```http
POST /api/stocks/transfer
```

## Access

```text
OWNER + DISTRIBUTOR
```

---

# 📥 STOCK RETURN

## Endpoint

```http
POST /api/stocks/return
```

## Access

```text
OWNER + DISTRIBUTOR
```

---

# 🛠️ STOCK ADJUSTMENT

## Endpoint

```http
POST /api/stocks/adjustment
```

## Access

```text
OWNER ONLY
```

---

# 💰 SALE STOCK

## Endpoint

```http
POST /api/stocks/sale
```

## Access

```text
RETAIL ONLY
```

---

# 📜 STOCK HISTORY

## Endpoint

```http
GET /api/stocks/history
```

## Access

```text
OWNER + DISTRIBUTOR
```

---

# 🧾 SALES MODULE

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/sales/summary` | OWNER, DISTRIBUTOR |
| GET | `/api/sales/history` | OWNER, DISTRIBUTOR |

---

# 📊 SALES SUMMARY

## Endpoint

```http
GET /api/sales/summary
```

## Access

```text
OWNER + DISTRIBUTOR
```

---

# 📜 SALES HISTORY

## Endpoint

```http
GET /api/sales/history
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?page=1
&limit=10
&startDate=2026-01-01
&endDate=2026-12-31
```

---

# 🤝 SETTLEMENT MODULE

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/settlements/summary` | OWNER |
| GET | `/api/settlements/:distributorId/detail` | OWNER |

---

# 📈 SETTLEMENT SUMMARY

## Endpoint

```http
GET /api/settlements/summary
```

## Access

```text
OWNER ONLY
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 📄 SETTLEMENT DETAIL

## Endpoint

```http
GET /api/settlements/:distributorId/detail
```

## Access

```text
OWNER ONLY
```

---

# 📊 ANALYTICS MODULE

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/analytics/summary` | OWNER |
| GET | `/api/analytics/sales-chart` | OWNER, DISTRIBUTOR |
| GET | `/api/analytics/daily-report` | OWNER, DISTRIBUTOR |
| GET | `/api/analytics/monthly-report` | OWNER, DISTRIBUTOR |
| GET | `/api/analytics/low-stock` | OWNER, DISTRIBUTOR |
| GET | `/api/analytics/recent-transactions` | OWNER, DISTRIBUTOR |

---

# 📊 DASHBOARD SUMMARY

## Endpoint

```http
GET /api/analytics/summary
```

## Access

```text
OWNER ONLY
```

---

# 📈 SALES CHART

## Endpoint

```http
GET /api/analytics/sales-chart
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 📆 DAILY REPORT

## Endpoint

```http
GET /api/analytics/daily-report
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?date=2026-05-19
```

---

# 📅 MONTHLY REPORT

## Endpoint

```http
GET /api/analytics/monthly-report
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?month=5
&year=2026
```

---

# 🚨 LOW STOCK ALERT

## Endpoint

```http
GET /api/analytics/low-stock
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?threshold=5
```

---

# 🕒 RECENT TRANSACTIONS

## Endpoint

```http
GET /api/analytics/recent-transactions
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?limit=10
```

---

# 📤 EXPORTS MODULE

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/exports/settlement-excel` | OWNER |
| GET | `/api/exports/monthly-report-excel` | OWNER |
| GET | `/api/exports/inventory-excel` | OWNER, DISTRIBUTOR |
| GET | `/api/exports/sales-history-excel` | OWNER, DISTRIBUTOR |
| GET | `/api/exports/settlement-pdf` | OWNER |
| GET | `/api/exports/monthly-report-pdf` | OWNER |
| GET | `/api/exports/sales-history-pdf` | OWNER, DISTRIBUTOR |

---

# 📊 SETTLEMENT EXCEL EXPORT

## Endpoint

```http
GET /api/exports/settlement-excel
```

## Access

```text
OWNER ONLY
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 📅 MONTHLY REPORT EXCEL EXPORT

## Endpoint

```http
GET /api/exports/monthly-report-excel
```

## Access

```text
OWNER ONLY
```

## Query Parameters

```http
?month=5
&year=2026
```

---

# 📦 INVENTORY EXCEL EXPORT

## Endpoint

```http
GET /api/exports/inventory-excel
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?threshold=5
```

---

# 🧾 SALES HISTORY EXCEL EXPORT

## Endpoint

```http
GET /api/exports/sales-history-excel
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 📄 SETTLEMENT PDF EXPORT

## Endpoint

```http
GET /api/exports/settlement-pdf
```

## Access

```text
OWNER ONLY
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 📄 MONTHLY REPORT PDF EXPORT

## Endpoint

```http
GET /api/exports/monthly-report-pdf
```

## Access

```text
OWNER ONLY
```

## Query Parameters

```http
?month=5
&year=2026
```

---

# 📄 SALES HISTORY PDF EXPORT

## Endpoint

```http
GET /api/exports/sales-history-pdf
```

## Access

```text
OWNER + DISTRIBUTOR
```

## Query Parameters

```http
?startDate=2026-01-01
&endDate=2026-12-31
```

---

# 👤 ROLE ACCESS SUMMARY

| Role | Access |
|---|---|
| OWNER | Full Access |
| DISTRIBUTOR | Inventory + Analytics + Export |
| RETAIL | Sale Stock + Retail Operations |

---

# 🔐 ROLE CAPABILITIES

## OWNER

Can:
- manage users
- manage products
- manage categories
- transfer stocks
- stock adjustment
- analytics
- settlements
- export excel/pdf
- full monitoring

---

## DISTRIBUTOR

Can:
- transfer stocks
- view stocks
- analytics
- inventory monitoring
- export inventory
- export sales history

---

## RETAIL

Can:
- sale stock
- view own stock
- operational selling

---

# 📌 SYSTEM STATUS

Backend sekarang berhasil memiliki:

## CORE SYSTEM
- authentication
- authorization
- RBAC
- inventory system
- sales system
- settlement system

---

## ANALYTICS SYSTEM
- dashboard analytics
- charts
- daily report
- monthly report
- low stock alert
- recent transactions

---

## EXPORT SYSTEM
- excel export
- pdf export
- finance report
- printable report
- audit reporting

---

# 🚀 FINAL RESULT

Backend sekarang berkembang menjadi:

```text
Enterprise Inventory & Distribution Backend System
```

dan sudah siap untuk:
- frontend dashboard
- operational monitoring
- finance reporting
- printable reporting
- business intelligence
- internal ERP foundation

