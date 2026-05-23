import prisma from "../config/prisma.js";

import { Prisma } from "@prisma/client";

import {
  SalesChartQuery,
  DailyReportQuery,
  MonthlyReportQuery,
  LowStockQuery,
  RecentTransactionQuery,
} from "./analytics.types.js";

export const getSummaryService =
  async () => {

    return {
      totalInventory: 1240,
      totalRetail: 32,
      totalDistributor: 8,
      totalTransactions: 12480,
    };
  };
  
export const getSalesChartService =
  async (
    query: SalesChartQuery
  ) => {

    /**
     * WHERE
     */
    const whereCondition:
      Prisma.StockMovementsWhereInput = {

      type: "SALE",

      ...(query.startDate &&
      query.endDate && {

        createdAt: {

          gte: new Date(
            query.startDate
          ),

          lte: new Date(
            query.endDate
          ),
        },
      }),
    };

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: whereCondition,

        orderBy: {
          createdAt: "asc",
        },
      });

    /**
     * GROUP BY DATE
     */
    const chartMap =
      new Map();

    for (const sale of sales) {

      const date =
        sale.createdAt
          .toISOString()
          .split("T")[0];

      /**
       * INIT
       */
      if (
        !chartMap.has(date)
      ) {

        chartMap.set(
          date,
          {

            date,

            totalRevenue: 0,

            totalQty: 0,

            totalTransactions: 0,
          }
        );
      }

      /**
       * CURRENT
       */
      const current =
        chartMap.get(date);
      current.totalRevenue +=
        sale.totalPrice || 0;
      current.totalQty +=
        sale.qty;
      current.totalTransactions += 1;
    }
    return Array.from(
      chartMap.values()
    );
  };

export const getDailyReportService =
  async (
    query: DailyReportQuery
  ) => {

    /**
     * TARGET DATE
     */
    const targetDate =
      query.date
        ? new Date(query.date)
        : new Date();

    /**
     * START DATE
     */
    const startDate =
      new Date(targetDate);

    startDate.setHours(
      0,
      0,
      0,
      0
    );

    /**
     * END DATE
     */
    const endDate =
      new Date(targetDate);

    endDate.setHours(
      23,
      59,
      59,
      999
    );

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {

          type: "SALE",

          createdAt: {

            gte: startDate,

            lte: endDate,
          },
        },

        include: {

          product: true,

          fromUser: true,
        },
      });

    /**
     * SUMMARY
     */
    let totalTransactions = 0;

    let totalQty = 0;

    let totalRevenue = 0;

    /**
     * PRODUCT MAP
     */
    const productMap =
      new Map();

    /**
     * RETAIL MAP
     */
    const retailMap =
      new Map();

    for (const sale of sales) {

      totalTransactions += 1;

      totalQty += sale.qty;

      totalRevenue +=
        sale.totalPrice || 0;

      /**
       * PRODUCT
       */
      const productName =
        sale.product.name;

      if (
        !productMap.has(
          productName
        )
      ) {

        productMap.set(
          productName,
          0
        );
      }

      productMap.set(

        productName,

        productMap.get(
          productName
        ) + sale.qty
      );

      /**
       * RETAIL
       */
      const retailName =
        sale.fromUser?.name ||
        "Unknown";

      if (
        !retailMap.has(
          retailName
        )
      ) {

        retailMap.set(
          retailName,
          0
        );
      }

      retailMap.set(

        retailName,

        retailMap.get(
          retailName
        ) + sale.qty
      );
    }

    /**
     * TOP PRODUCT
     */
    let topProduct =
      "No sales";

    let topProductQty = 0;

    for (
      const [
        name,
        qty,
      ] of productMap
    ) {

      if (
        qty >
        topProductQty
      ) {

        topProductQty =
          qty;

        topProduct = name;
      }
    }

    /**
     * TOP RETAIL
     */
    let topRetail =
      "No sales";

    let topRetailQty = 0;

    for (
      const [
        name,
        qty,
      ] of retailMap
    ) {

      if (
        qty >
        topRetailQty
      ) {

        topRetailQty =
          qty;

        topRetail = name;
      }
    }

    return {

      date:
        startDate
          .toISOString()
          .split("T")[0],

      totalTransactions,

      totalQty,

      totalRevenue,

      topProduct,

      topRetail,
    };
  };

export const getMonthlyReportService =
  async (
    query: MonthlyReportQuery
  ) => {

    /**
     * CURRENT DATE
     */
    const now =
      new Date();

    /**
     * TARGET MONTH
     */
    const month =
      query.month
        ? Number(query.month)
        : now.getMonth() + 1;

    /**
     * TARGET YEAR
     */
    const year =
      query.year
        ? Number(query.year)
        : now.getFullYear();

    /**
     * START DATE
     */
    const startDate =
      new Date(
        year,
        month - 1,
        1
      );

    /**
     * END DATE
     */
    const endDate =
      new Date(
        year,
        month,
        0,
        23,
        59,
        59,
        999
      );

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {

          type: "SALE",

          createdAt: {

            gte: startDate,

            lte: endDate,
          },
        },

        include: {

          product: true,

          fromUser: true,
        },
      });

    /**
     * SUMMARY
     */
    let totalTransactions = 0;

    let totalQty = 0;

    let totalRevenue = 0;

    /**
     * PRODUCT MAP
     */
    const productMap =
      new Map();

    /**
     * RETAIL MAP
     */
    const retailMap =
      new Map();

    for (const sale of sales) {

      totalTransactions += 1;

      totalQty += sale.qty;

      totalRevenue +=
        sale.totalPrice || 0;

      /**
       * PRODUCT
       */
      const productName =
        sale.product.name;

      if (
        !productMap.has(
          productName
        )
      ) {

        productMap.set(
          productName,
          0
        );
      }

      productMap.set(

        productName,

        productMap.get(
          productName
        ) + sale.qty
      );

      /**
       * RETAIL
       */
      const retailName =
        sale.fromUser?.name ||
        "Unknown";

      if (
        !retailMap.has(
          retailName
        )
      ) {

        retailMap.set(
          retailName,
          0
        );
      }

      retailMap.set(

        retailName,

        retailMap.get(
          retailName
        ) + sale.qty
      );
    }

    /**
     * TOP PRODUCT
     */
    let topProduct =
      "No sales";

    let topProductQty = 0;

    for (
      const [
        name,
        qty,
      ] of productMap
    ) {

      if (
        qty >
        topProductQty
      ) {

        topProductQty =
          qty;

        topProduct = name;
      }
    }

    /**
     * TOP RETAIL
     */
    let topRetail =
      "No sales";

    let topRetailQty = 0;

    for (
      const [
        name,
        qty,
      ] of retailMap
    ) {

      if (
        qty >
        topRetailQty
      ) {

        topRetailQty =
          qty;

        topRetail = name;
      }
    }

    return {

      month,

      year,

      totalTransactions,

      totalQty,

      totalRevenue,

      topProduct,

      topRetail,
    };
  };

export const getLowStockService =
  async (
    query: LowStockQuery
  ) => {

    /**
     * THRESHOLD
     */
    const threshold =
      query.threshold
        ? Number(
            query.threshold
          )
        : 5;

    /**
     * GET LOW STOCK
     */
    const stocks =
      await prisma.userStocks.findMany({

        where: {

          qty: {

            lte: threshold,
          },
        },

        include: {

          user: true,

          product: true,
        },

        orderBy: {

          qty: "asc",
        },
      });

    return stocks.map(
      (stock) => ({

        userId:
          stock.user.id,

        userName:
          stock.user.name,

        productId:
          stock.product.id,

        productName:
          stock.product.name,

        qty: stock.qty,
      })
    );
  };

export const getRecentTransactionsService =
  async (
    query: RecentTransactionQuery
  ) => {

    /**
     * LIMIT
     */
    const limit =
      query.limit
        ? Number(
            query.limit
          )
        : 10;

    /**
     * GET TRANSACTIONS
     */
    const transactions =
      await prisma.stockMovements.findMany({

        where: {

          type: {
            in: [

              "SALE",

              "TRANSFER",

              "RETURN",

              "ADJUSTMENT",
            ],
          },
        },

        include: {

          fromUser: true,

          toUser: true,

          product: true,
        },

        orderBy: {

          createdAt: "desc",
        },

        take: limit,
      });

    return transactions.map(
      (transaction) => ({

        id: transaction.id,

        type:
          transaction.type,

        user:
          transaction.fromUser
            ?.name ||
          transaction.toUser
            ?.name ||
          "System",

        product:
          transaction.product
            .name,

        qty:
          transaction.qty,

        salePrice:
          transaction.salePrice,

        totalPrice:
          transaction.totalPrice,

        createdAt:
          transaction.createdAt,
      })
    );
  };