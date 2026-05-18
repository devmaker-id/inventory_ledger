import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

import {
  AdjustmentStockBody,
  ReturnStockBody,
  SalesHistoryQuery,
  SaleStockBody,
  TransferStockBody,
  SettlementQuery,
  SettlementDetailQuery,
} from "./stocks.types.js";

export const transferStockService =
  async (
    fromUserId: number,
    body: TransferStockBody
  ) => {

    return await processStockMovement(
      fromUserId,

      body.toUserId,

      body.productId,

      body.qty,

      "DISTRIBUTION",

      body.note
    );
  };

export const returnStockService =
  async (
    fromUserId: number,
    body: ReturnStockBody
  ) => {

    return await processStockMovement(
      fromUserId,

      body.toUserId,

      body.productId,

      body.qty,

      "RETURN",

      body.note
    );
  };

export const getMyStocksService = async (
  userId: number
) => {

  return await prisma.userStocks.findMany({

    where: {
      userId,
    },

    include: {

      product: {
        include: {
          category: true,
        },
      },
    },

    orderBy: {
      id: "desc",
    },
  });
};

export const getStockHistoryService =
  async (
    userId: number
  ) => {

    return await prisma.stockMovements.findMany({

      where: {

        OR: [
          {
            fromUserId: userId,
          },

          {
            toUserId: userId,
          },
        ],
      },

      include: {

        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        product: {
          select: {
            id: true,
            name: true,
            basePrice: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });
  };

const processStockMovement = async (
  fromUserId: number,

  toUserId: number,

  productId: number,

  qty: number,

  type: string,

  note?: string
) => {

  const senderStock =
    await prisma.userStocks.findFirst({

      where: {
        userId: fromUserId,

        productId,
      },
    });

  if (!senderStock) {
    throw new Error(
      "Sender stock not found"
    );
  }

  if (senderStock.qty < qty) {
    throw new Error(
      "Insufficient stock"
    );
  }

  return await prisma.$transaction(
    async (tx) => {

      /**
       * REDUCE SENDER STOCK
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
       * FIND RECEIVER STOCK
       */
      const receiverStock =
        await tx.userStocks.findFirst({

          where: {
            userId: toUserId,

            productId,
          },
        });

      /**
       * CREATE RECEIVER STOCK
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
         * INCREMENT RECEIVER
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
       * CREATE MOVEMENT
       */
      await tx.stockMovements.create({

        data: {
          fromUserId,

          toUserId,

          productId,

          qty,

          type,

          note,
        },
      });

      return true;
    }
  );
};

export const adjustmentStockService =
  async (
    body: AdjustmentStockBody
  ) => {

    const {
      userId,
      productId,
      qty,
      note,
    } = body;

    const stock =
      await prisma.userStocks.findFirst({

        where: {
          userId,

          productId,
        },
      });

    /**
     * JIKA BELUM ADA
     */
    if (!stock) {

      if (qty < 0) {
        throw new Error(
          "Cannot reduce non-existing stock"
        );
      }

      await prisma.userStocks.create({

        data: {
          userId,

          productId,

          qty,
        },
      });

    } else {

      /**
       * CEK NEGATIVE
       */
      if (
        stock.qty + qty < 0
      ) {
        throw new Error(
          "Stock cannot be negative"
        );
      }

      await prisma.userStocks.update({

        where: {
          id: stock.id,
        },

        data: {
          qty: {
            increment: qty,
          },
        },
      });
    }

    /**
     * SAVE MOVEMENT
     */
    await prisma.stockMovements.create({

      data: {

        toUserId: userId,

        productId,

        qty: Math.abs(qty),

        type: "ADJUSTMENT",

        note,
      },
    });

    return true;
  };

export const saleStockService =
  async (
    userId: number,
    body: SaleStockBody
  ) => {

    const {
      productId,
      qty,
      salePrice,
      note,
    } = body;

    const stock =
      await prisma.userStocks.findFirst({

        where: {
          userId,

          productId,
        },
      });

    if (!stock) {
      throw new Error(
        "Stock not found"
      );
    }

    if (stock.qty < qty) {
      throw new Error(
        "Insufficient stock"
      );
    }

    const totalPrice =
      qty * salePrice;

    return await prisma.$transaction(
      async (tx) => {

        /**
         * REDUCE STOCK
         */
        await tx.userStocks.update({
          where: {
            id: stock.id,
          },
          data: {
            qty: {
              decrement: qty,
            },
          },
        });

        /**
         * CREATE SALE MOVEMENT
         */
        await tx.stockMovements.create({
          data: {
            fromUserId: userId,
            productId,
            qty,
            salePrice,
            totalPrice,
            type: "SALE",
            note,
          },
        });
        return true;
      }
    );
  };

export const getSalesSummaryService =
  async () => {

    const sales =
      await prisma.stockMovements.aggregate({

        where: {
          type: "SALE",
        },

        _sum: {

          qty: true,

          totalPrice: true,
        },

        _count: {
          id: true,
        },
      });

    return {

      totalTransactions:
        sales._count.id,

      totalQty:
        sales._sum.qty || 0,

      totalRevenue:
        sales._sum.totalPrice || 0,
    };
  };

export const getSalesHistoryService =
  async (
    query: SalesHistoryQuery
  ) => {

    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 10;

    const skip =
      (page - 1) * limit;

    /**
     * SEARCH
     */
    const search =
      query.search || "";

    /**
     * WHERE CONDITION
     */
    const whereCondition:
      Prisma.StockMovementsWhereInput = {

      type: "SALE",

      ...(query.productId && {

        productId:
          Number(query.productId),
      }),

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

      ...(search && {

        fromUser: {

          name: {

            contains: search,

            mode:
              Prisma.QueryMode.insensitive,
          },
        },
      }),
    };

    /**
     * FIND SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: whereCondition,

        skip,

        take: limit,

        include: {

          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          product: {
            select: {
              id: true,
              name: true,
              basePrice: true,
            },
          },
        },

        orderBy: {
          id: "desc",
        },
      });

    /**
     * TOTAL
     */
    const total =
      await prisma.stockMovements.count({

        where: whereCondition,
      });

    return {

      data: sales,

      pagination: {

        total,

        page,

        limit,

        totalPages:
          Math.ceil(total / limit),
      },
    };
  };

export const getDistributorSummaryService =
  async () => {

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {
          type: "SALE",
        },

        include: {

          fromUser: {

            include: {

              parent: true,
            },
          },
        },
      });

    /**
     * GROUP BY DISTRIBUTOR
     */
    const summaryMap =
      new Map();

    for (const sale of sales) {

      const distributor =
        sale.fromUser?.parent;

      if (!distributor) {
        continue;
      }

      const distributorId =
        distributor.id;

      /**
       * INIT
       */
      if (
        !summaryMap.has(
          distributorId
        )
      ) {

        summaryMap.set(
          distributorId,
          {

            distributorId,

            distributorName:
              distributor.name,

            totalTransactions: 0,

            totalQty: 0,

            totalRevenue: 0,

            ownerShare: 0,

            distributorShare: 0,
          }
        );
      }

      /**
       * CURRENT SUMMARY
       */
      const current =
        summaryMap.get(
          distributorId
        );

      const revenue =
        sale.totalPrice || 0;

      /**
       * UPDATE
       */
      current.totalTransactions += 1;

      current.totalQty +=
        sale.qty;

      current.totalRevenue +=
        revenue;

      current.ownerShare +=
        revenue * 0.7;

      current.distributorShare +=
        revenue * 0.3;
    }

    return Array.from(
      summaryMap.values()
    );
  };

  export const getRetailSummaryService =
  async () => {

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {
          type: "SALE",
        },

        include: {

          fromUser: {

            include: {

              parent: true,
            },
          },
        },
      });

    /**
     * GROUP RETAIL
     */
    const summaryMap =
      new Map();

    for (const sale of sales) {

      const retail =
        sale.fromUser;

      if (!retail) {
        continue;
      }

      const retailId =
        retail.id;

      /**
       * INIT
       */
      if (
        !summaryMap.has(
          retailId
        )
      ) {

        summaryMap.set(
          retailId,
          {

            retailId,

            retailName:
              retail.name,

            distributorName:
              retail.parent?.name ||
              "-",

            totalTransactions: 0,

            totalQty: 0,

            totalRevenue: 0,
          }
        );
      }

      /**
       * CURRENT
       */
      const current =
        summaryMap.get(
          retailId
        );

      current.totalTransactions += 1;

      current.totalQty +=
        sale.qty;

      current.totalRevenue +=
        sale.totalPrice || 0;
    }

    return Array.from(
      summaryMap.values()
    );
  };

  export const getTopProductsService =
  async () => {

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {
          type: "SALE",
        },

        include: {

          product: true,
        },
      });

    /**
     * GROUP PRODUCTS
     */
    const summaryMap =
      new Map();

    for (const sale of sales) {

      const product =
        sale.product;

      const productId =
        product.id;

      /**
       * INIT
       */
      if (
        !summaryMap.has(
          productId
        )
      ) {

        summaryMap.set(
          productId,
          {

            productId,

            productName:
              product.name,

            totalTransactions: 0,

            totalQty: 0,

            totalRevenue: 0,
          }
        );
      }

      /**
       * CURRENT
       */
      const current =
        summaryMap.get(
          productId
        );

      current.totalTransactions += 1;

      current.totalQty +=
        sale.qty;

      current.totalRevenue +=
        sale.totalPrice || 0;
    }

    /**
     * SORT DESC
     */
    return Array.from(
      summaryMap.values()
    ).sort(
      (a, b) =>
        b.totalQty -
        a.totalQty
    );
  };

export const getSettlementReportService =
  async (
    query: SettlementQuery
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

        include: {

          fromUser: {

            include: {

              parent: true,
            },
          },
        },
      });

    /**
     * GROUP DISTRIBUTOR
     */
    const summaryMap =
      new Map();

    for (const sale of sales) {

      const distributor =
        sale.fromUser?.parent;

      if (!distributor) {
        continue;
      }

      const distributorId =
        distributor.id;

      /**
       * INIT
       */
      if (
        !summaryMap.has(
          distributorId
        )
      ) {

        summaryMap.set(
          distributorId,
          {

            distributorId,

            distributorName:
              distributor.name,

            period: {

              startDate:
                query.startDate ||
                null,

              endDate:
                query.endDate ||
                null,
            },

            totalTransactions: 0,

            totalQty: 0,

            totalRevenue: 0,

            ownerShare: 0,

            distributorShare: 0,
          }
        );
      }

      /**
       * CURRENT
       */
      const current =
        summaryMap.get(
          distributorId
        );

      const revenue =
        sale.totalPrice || 0;

      current.totalTransactions += 1;

      current.totalQty +=
        sale.qty;

      current.totalRevenue +=
        revenue;

      current.ownerShare +=
        revenue * 0.7;

      current.distributorShare +=
        revenue * 0.3;
    }

    return Array.from(
      summaryMap.values()
    );
  };

export const getSettlementDetailService =
  async (

    distributorId: number,

    query: SettlementDetailQuery
  ) => {

    /**
     * GET DISTRIBUTOR
     */
    const distributor =
      await prisma.users.findUnique({

        where: {
          id: distributorId,
        },
      });

    if (!distributor) {

      throw new Error(
        "Distributor not found"
      );
    }

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: {

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

          fromUser: {

            parentId:
              distributorId,
          },
        },

        include: {

          fromUser: true,

          product: true,
        },

        orderBy: {
          id: "desc",
        },
      });

    /**
     * SUMMARY
     */
    let totalTransactions = 0;

    let totalQty = 0;

    let totalRevenue = 0;

    for (const sale of sales) {

      totalTransactions += 1;

      totalQty += sale.qty;

      totalRevenue +=
        sale.totalPrice || 0;
    }

    return {

      distributor: {

        id: distributor.id,

        name: distributor.name,
      },

      summary: {

        totalTransactions,

        totalQty,

        totalRevenue,

        ownerShare:
          totalRevenue * 0.7,

        distributorShare:
          totalRevenue * 0.3,
      },

      transactions:
        sales.map((sale) => ({

          id: sale.id,

          retailName:
            sale.fromUser?.name,

          productName:
            sale.product.name,

          qty: sale.qty,

          salePrice:
            sale.salePrice,

          totalPrice:
            sale.totalPrice,

          createdAt:
            sale.createdAt,
        })),
    };
  };