# EPISODE 8 — STOCK DISTRIBUTION SYSTEM

## 📌 Project
Seller Backend API

---

# 🚀 Tujuan Episode 8

Pada episode ini backend berubah dari:

```text
Product CRUD API
```

menjadi:

```text
Stock Distribution & Transaction System
```

Backend sekarang fokus pada:

- distribusi stok voucher
- pencatatan perpindahan stok
- histori stok
- audit transaksi
- stok per user
- retur stok
- laporan distribusi

---

# 🧠 Konsep Baru Yang Sangat Penting

## ❌ SEBELUM

```text
Products.stock
```

Stok menempel ke product.

---

## ✅ SEKARANG

```text
UserStocks.qty
```

Stok dimiliki oleh user.

---

# 🏗️ FLOW BISNIS

```text
OWNER
  ↓ transfer stock
DISTRIBUTOR
  ↓ transfer stock
RETAIL
  ↓ jual voucher
CUSTOMER
```

---

# 📁 STRUKTUR FOLDER EPISODE 8

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
├── stock-movements/
│   ├── stock-movements.controller.ts
│   ├── stock-movements.routes.ts
│   └── stock-movements.service.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   └── role.middleware.ts
```

---

# 📄 File: stocks.types.ts

```ts
export interface TransferStockBody {
  toUserId: number;
  productId: number;
  qty: number;
  note?: string;
}
```

---

# 📄 File: stocks.validation.ts

```ts
export const transferStockValidation = (
  body: any
) => {
  const errors: string[] = [];

  if (!body.toUserId) {
    errors.push("toUserId is required");
  }

  if (!body.productId) {
    errors.push("productId is required");
  }

  if (!body.qty) {
    errors.push("qty is required");
  }

  if (body.qty <= 0) {
    errors.push("qty must be greater than 0");
  }

  return errors;
};
```

---

# 📄 File: stocks.service.ts

```ts
import prisma from "../config/prisma.js";

export const transferStockService = async (
  fromUserId: number,
  body: any
) => {

  const {
    toUserId,
    productId,
    qty,
    note,
  } = body;

  /**
   * CEK STOK PENGIRIM
   */
  const senderStock = await prisma.userStocks.findFirst({
    where: {
      userId: fromUserId,
      productId,
    },
  });

  if (!senderStock || senderStock.qty < qty) {
    throw new Error("Insufficient stock");
  }

  /**
   * TRANSACTION
   */
  return await prisma.$transaction(async (tx) => {

    /**
     * KURANGI STOK PENGIRIM
     */
    await tx.userStocks.update({
      where: {
        id: senderStock.id,
      },

      data: {
        qty: {
          decrement: qty,
        },
      },
    });

    /**
     * CEK STOK PENERIMA
     */
    const receiverStock =
      await tx.userStocks.findFirst({
        where: {
          userId: toUserId,
          productId,
        },
      });

    /**
     * JIKA BELUM ADA
     */
    if (!receiverStock) {

      await tx.userStocks.create({
        data: {
          userId: toUserId,
          productId,
          qty,
        },
      });

    } else {

      /**
       * TAMBAH STOK
       */
      await tx.userStocks.update({
        where: {
          id: receiverStock.id,
        },

        data: {
          qty: {
            increment: qty,
          },
        },
      });
    }

    /**
     * CATAT HISTORI
     */
    await tx.stockMovements.create({
      data: {
        fromUserId,
        toUserId,
        productId,
        qty,
        type: "DISTRIBUTION",
        note,
      },
    });

    return true;
  });
};

export const getMyStocksService = async (
  userId: number
) => {

  return await prisma.userStocks.findMany({
    where: {
      userId,
    },

    include: {
      product: true,
    },

    orderBy: {
      id: "desc",
    },
  });
};
```

---

# 📄 File: stocks.controller.ts

```ts
import { Request, Response } from "express";

import {
  transferStockService,
  getMyStocksService,
} from "./stocks.service.js";

import {
  transferStockValidation,
} from "./stocks.validation.js";

import {
  TransferStockBody,
} from "./stocks.types.js";

export const transferStockController = async (
  req: Request<{}, {}, TransferStockBody>,
  res: Response
) => {
  try {

    const errors = transferStockValidation(
      req.body
    );

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const fromUserId = req.user?.userId as number;

    await transferStockService(
      fromUserId,
      req.body
    );

    return res.json({
      success: true,
      message: "Stock transferred successfully",
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyStocksController = async (
  req: Request,
  res: Response
) => {
  try {

    const userId = req.user?.userId as number;

    const stocks = await getMyStocksService(
      userId
    );

    return res.json({
      success: true,
      data: stocks,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

# 📄 File: stocks.routes.ts

```ts
import { Router } from "express";

import {
  transferStockController,
  getMyStocksController,
} from "./stocks.controller.js";

import {
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

const router = Router();

/**
 * PROTECTED
 */
router.use(verifyToken);

/**
 * OWNER + DISTRIBUTOR
 */
router.use(
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  )
);

/**
 * TRANSFER STOCK
 */
router.post(
  "/transfer",
  transferStockController
);

/**
 * MY STOCKS
 */
router.get(
  "/me",
  getMyStocksController
);

export default router;
```

---

# 📄 app.ts

Tambahkan route baru:

```ts
import stockRoutes from "./stocks/stocks.routes.js";

app.use("/api/stocks", stockRoutes);
```

---

# 🧪 TESTING FLOW

## TRANSFER STOCK

```bash
POST /api/stocks/transfer
```

Body:

```json
{
  "toUserId": 2,
  "productId": 1,
  "qty": 100,
  "note": "Distribusi wilayah barat"
}
```

---

# 📊 HASIL SETELAH EPISODE 8

Backend sekarang mampu:

- transfer stok antar user
- menyimpan histori stok
- audit distribusi
- menghitung stok user
- mendukung retur stok
- siap untuk laporan penjualan

---

# 🚀 NEXT EPISODE 9

## SALES REPORT SYSTEM

Fitur:

- laporan penjualan retail
- laporan distributor
- periode laporan
- settlement system
- revenue sharing

