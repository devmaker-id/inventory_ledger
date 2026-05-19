import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

import {
  PassThrough,
} from "stream";

import prisma
from "../config/prisma.js";

import {
  SettlementExportQuery,
  MonthlyReportExportQuery,
  InventoryExportQuery,
  SalesHistoryExportQuery,
} from "./exports.types.js";

import {
  createWorkbook,
} from "./exports.utils.js";

import {
  getMonthlyReportService,
} from "../analytics/analytics.service.js";

export const exportSettlementExcelService =
  async (
    query: SettlementExportQuery
  ) => {

    /**
     * WHERE
     */
    const whereCondition: any = {

      type: "SALE",
    };

    if (
      query.startDate &&
      query.endDate
    ) {

      whereCondition.createdAt = {

        gte: new Date(
          query.startDate
        ),

        lte: new Date(
          query.endDate
        ),
      };
    }

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
     * GROUP
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

      if (
        !summaryMap.has(
          distributorId
        )
      ) {

        summaryMap.set(
          distributorId,
          {

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

    /**
     * WORKBOOK
     */
    const workbook =
      createWorkbook();

    /**
     * WORKSHEET
     */
    const worksheet =
      workbook.addWorksheet(
        "Settlement Report"
      );

    /**
     * HEADERS
     */
    worksheet.columns = [

      {
        header:
          "Distributor",

        key:
          "distributorName",

        width: 30,
      },

      {
        header:
          "Transactions",

        key:
          "totalTransactions",

        width: 15,
      },

      {
        header:
          "Qty",

        key:
          "totalQty",

        width: 15,
      },

      {
        header:
          "Revenue",

        key:
          "totalRevenue",

        width: 20,
      },

      {
        header:
          "Owner Share",

        key:
          "ownerShare",

        width: 20,
      },

      {
        header:
          "Distributor Share",

        key:
          "distributorShare",

        width: 20,
      },
    ];

    /**
     * ROWS
     */
    for (
      const row of
      summaryMap.values()
    ) {

      worksheet.addRow(row);
    }

    /**
     * BUFFER
     */
    const buffer =
      await workbook.xlsx.writeBuffer();

    return buffer;
  };

export const exportMonthlyReportExcelService =
  async (
    query: MonthlyReportExportQuery
  ) => {

    /**
     * GET REPORT
     */
    const report =
      await getMonthlyReportService(
        query
      );

    /**
     * WORKBOOK
     */
    const workbook =
      createWorkbook();

    /**
     * WORKSHEET
     */
    const worksheet =
      workbook.addWorksheet(
        "Monthly Report"
      );

    /**
     * HEADERS
     */
    worksheet.columns = [

      {
        header: "Month",

        key: "month",

        width: 15,
      },

      {
        header: "Year",

        key: "year",

        width: 15,
      },

      {
        header:
          "Transactions",

        key:
          "totalTransactions",

        width: 20,
      },

      {
        header:
          "Qty",

        key:
          "totalQty",

        width: 15,
      },

      {
        header:
          "Revenue",

        key:
          "totalRevenue",

        width: 20,
      },

      {
        header:
          "Top Product",

        key:
          "topProduct",

        width: 30,
      },

      {
        header:
          "Top Retail",

        key:
          "topRetail",

        width: 30,
      },
    ];

    /**
     * ROW
     */
    worksheet.addRow({

      month:
        report.month,

      year:
        report.year,

      totalTransactions:
        report.totalTransactions,

      totalQty:
        report.totalQty,

      totalRevenue:
        report.totalRevenue,

      topProduct:
        report.topProduct,

      topRetail:
        report.topRetail,
    });

    /**
     * BUFFER
     */
    const buffer =
      await workbook.xlsx.writeBuffer();

    return buffer;
  };

export const exportInventoryExcelService =
  async (
    query: InventoryExportQuery
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
     * GET STOCKS
     */
    const stocks =
      await prisma.userStocks.findMany({

        include: {

          user: true,

          product: true,
        },

        orderBy: {

          qty: "asc",
        },
      });

    /**
     * WORKBOOK
     */
    const workbook =
      createWorkbook();

    /**
     * WORKSHEET
     */
    const worksheet =
      workbook.addWorksheet(
        "Inventory Report"
      );

    /**
     * HEADERS
     */
    worksheet.columns = [

      {
        header: "User",

        key: "userName",

        width: 30,
      },

      {
        header: "Product",

        key: "productName",

        width: 30,
      },

      {
        header: "Qty",

        key: "qty",

        width: 15,
      },

      {
        header: "Status",

        key: "status",

        width: 20,
      },
    ];

    /**
     * ROWS
     */
    for (const stock of stocks) {

      worksheet.addRow({

        userName:
          stock.user.name,

        productName:
          stock.product.name,

        qty:
          stock.qty,

        status:
          stock.qty <= threshold
            ? "LOW"
            : "NORMAL",
      });
    }

    /**
     * BUFFER
     */
    const buffer =
      await workbook.xlsx.writeBuffer();

    return buffer;
  };

export const exportSalesHistoryExcelService =
  async (
    query: SalesHistoryExportQuery
  ) => {

    /**
     * WHERE
     */
    const whereCondition: any = {

      type: "SALE",
    };

    if (
      query.startDate &&
      query.endDate
    ) {

      whereCondition.createdAt = {

        gte: new Date(
          query.startDate
        ),

        lte: new Date(
          query.endDate
        ),
      };
    }

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: whereCondition,

        include: {

          fromUser: true,

          product: true,
        },

        orderBy: {

          createdAt: "desc",
        },
      });

    /**
     * WORKBOOK
     */
    const workbook =
      createWorkbook();

    /**
     * WORKSHEET
     */
    const worksheet =
      workbook.addWorksheet(
        "Sales History"
      );

    /**
     * HEADERS
     */
    worksheet.columns = [

      {
        header: "Retail",

        key: "retail",

        width: 30,
      },

      {
        header: "Product",

        key: "product",

        width: 30,
      },

      {
        header: "Qty",

        key: "qty",

        width: 15,
      },

      {
        header:
          "Sale Price",

        key:
          "salePrice",

        width: 20,
      },

      {
        header:
          "Total Price",

        key:
          "totalPrice",

        width: 20,
      },

      {
        header:
          "Transaction Date",

        key:
          "createdAt",

        width: 30,
      },
    ];

    /**
     * ROWS
     */
    for (const sale of sales) {

      worksheet.addRow({

        retail:
          sale.fromUser?.name,

        product:
          sale.product.name,

        qty:
          sale.qty,

        salePrice:
          sale.salePrice,

        totalPrice:
          sale.totalPrice,

        createdAt:
          sale.createdAt
            .toISOString(),
      });
    }

    /**
     * BUFFER
     */
    const buffer =
      await workbook.xlsx.writeBuffer();

    return buffer;
  };

export const exportSettlementPdfService =
  async (
    query: SettlementExportQuery
  ) => {

    /**
     * WHERE
     */
    const whereCondition: any = {

      type: "SALE",
    };

    if (
      query.startDate &&
      query.endDate
    ) {

      whereCondition.createdAt = {

        gte: new Date(
          query.startDate
        ),

        lte: new Date(
          query.endDate
        ),
      };
    }

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
     * SUMMARY MAP
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

      if (
        !summaryMap.has(
          distributorId
        )
      ) {

        summaryMap.set(
          distributorId,
          {

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

    /**
     * PDF DOC
     */
    const doc =
      new PDFDocument({

        margin: 40,

        size: "A4",
      });

    /**
     * STREAM
     */
    const stream =
      new PassThrough();

    doc.pipe(stream);

    /**
     * TITLE
     */
    doc
      .fontSize(20)
      .text(
        "Settlement Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    /**
     * TABLE HEADER
     */
    doc
      .fontSize(12)
      .text(
        "Distributor",
        50,
        doc.y,
      );

    doc.text(
      "Revenue",
      200,
      doc.y - 15,
    );

    doc.text(
      "Owner Share",
      320,
      doc.y - 15,
    );

    doc.text(
      "Distributor Share",
      450,
      doc.y - 15,
    );

    doc.moveDown();

    /**
     * ROWS
     */
    for (
      const row of
      summaryMap.values()
    ) {

      doc.text(
        row.distributorName,
        50,
        doc.y,
      );

      doc.text(
        String(
          row.totalRevenue
        ),
        200,
        doc.y - 15,
      );

      doc.text(
        String(
          row.ownerShare
        ),
        320,
        doc.y - 15,
      );

      doc.text(
        String(
          row.distributorShare
        ),
        450,
        doc.y - 15,
      );

      doc.moveDown();
    }

    /**
     * END
     */
    doc.end();

    /**
     * BUFFER
     */
    const chunks:
      Buffer[] = [];

    return new Promise<Buffer>(
      (
        resolve,
        reject
      ) => {

        stream.on(
          "data",
          (
            chunk
          ) => {

            chunks.push(
              chunk
            );
          }
        );

        stream.on(
          "end",
          () => {

            resolve(
              Buffer.concat(
                chunks
              )
            );
          }
        );

        stream.on(
          "error",
          reject
        );
      }
    );
  };

export const exportMonthlyReportPdfService =
  async (
    query: MonthlyReportExportQuery
  ) => {

    /**
     * GET REPORT
     */
    const report =
      await getMonthlyReportService(
        query
      );

    /**
     * PDF DOC
     */
    const doc =
      new PDFDocument({

        margin: 40,

        size: "A4",
      });

    /**
     * STREAM
     */
    const stream =
      new PassThrough();

    doc.pipe(stream);

    /**
     * TITLE
     */
    doc
      .fontSize(20)
      .text(
        "Monthly Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    /**
     * CONTENT
     */
    doc
      .fontSize(14)
      .text(
        `Month: ${report.month}`
      );

    doc.text(
      `Year: ${report.year}`
    );

    doc.text(
      `Total Transactions: ${report.totalTransactions}`
    );

    doc.text(
      `Total Qty: ${report.totalQty}`
    );

    doc.text(
      `Total Revenue: ${report.totalRevenue}`
    );

    doc.text(
      `Top Product: ${report.topProduct}`
    );

    doc.text(
      `Top Retail: ${report.topRetail}`
    );

    /**
     * END
     */
    doc.end();

    /**
     * BUFFER
     */
    const chunks:
      Buffer[] = [];

    return new Promise<Buffer>(
      (
        resolve,
        reject
      ) => {

        stream.on(
          "data",
          (
            chunk
          ) => {

            chunks.push(
              chunk
            );
          }
        );

        stream.on(
          "end",
          () => {

            resolve(
              Buffer.concat(
                chunks
              )
            );
          }
        );

        stream.on(
          "error",
          reject
        );
      }
    );
  };

export const exportSalesHistoryPdfService =
  async (
    query: SalesHistoryExportQuery
  ) => {

    /**
     * WHERE
     */
    const whereCondition: any = {

      type: "SALE",
    };

    if (
      query.startDate &&
      query.endDate
    ) {

      whereCondition.createdAt = {

        gte: new Date(
          query.startDate
        ),

        lte: new Date(
          query.endDate
        ),
      };
    }

    /**
     * GET SALES
     */
    const sales =
      await prisma.stockMovements.findMany({

        where: whereCondition,

        include: {

          fromUser: true,

          product: true,
        },

        orderBy: {

          createdAt: "desc",
        },
      });

    /**
     * PDF DOC
     */
    const doc =
      new PDFDocument({

        margin: 40,

        size: "A4",
      });

    /**
     * STREAM
     */
    const stream =
      new PassThrough();

    doc.pipe(stream);

    /**
     * TITLE
     */
    doc
      .fontSize(20)
      .text(
        "Sales History Report",
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    /**
     * TABLE HEADER
     */
    doc
      .fontSize(11)
      .text(
        "Retail",
        50,
        doc.y
      );

    doc.text(
      "Product",
      150,
      doc.y - 15
    );

    doc.text(
      "Qty",
      280,
      doc.y - 15
    );

    doc.text(
      "Total",
      340,
      doc.y - 15
    );

    doc.text(
      "Date",
      430,
      doc.y - 15
    );

    doc.moveDown();

    /**
     * ROWS
     */
    for (const sale of sales) {

      doc.text(
        sale.fromUser?.name ||
          "-",
        50,
        doc.y
      );

      doc.text(
        sale.product.name,
        150,
        doc.y - 15
      );

      doc.text(
        String(
          sale.qty
        ),
        280,
        doc.y - 15
      );

      doc.text(
        String(
          sale.totalPrice
        ),
        340,
        doc.y - 15
      );

      doc.text(
        sale.createdAt
          .toISOString()
          .split("T")[0],
        430,
        doc.y - 15
      );

      doc.moveDown();
    }

    /**
     * END
     */
    doc.end();

    /**
     * BUFFER
     */
    const chunks:
      Buffer[] = [];

    return new Promise<Buffer>(
      (
        resolve,
        reject
      ) => {

        stream.on(
          "data",
          (
            chunk
          ) => {

            chunks.push(
              chunk
            );
          }
        );

        stream.on(
          "end",
          () => {

            resolve(
              Buffer.concat(
                chunks
              )
            );
          }
        );

        stream.on(
          "error",
          reject
        );
      }
    );
  };