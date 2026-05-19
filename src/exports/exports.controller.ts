import {
  Request,
  Response,
} from "express";

import {
  exportSettlementExcelService,
  exportMonthlyReportExcelService,
  exportInventoryExcelService,
  exportSalesHistoryExcelService,
  exportSettlementPdfService,
  exportMonthlyReportPdfService,
  exportSalesHistoryPdfService,
} from "./exports.service.js";

import {
  settlementExportValidation,
  monthlyReportExportValidation,
  inventoryExportValidation,
  salesHistoryExportValidation,
} from "./exports.validation.js";

import {
  SettlementExportQuery,
  MonthlyReportExportQuery,
  InventoryExportQuery,
  SalesHistoryExportQuery,
} from "./exports.types.js";

export const exportSettlementExcelController =
  async (

    req: Request<
      {},
      {},
      {},
      SettlementExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        settlementExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportSettlementExcelService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=settlement-report.xlsx"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportMonthlyReportExcelController =
  async (

    req: Request<
      {},
      {},
      {},
      MonthlyReportExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        monthlyReportExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportMonthlyReportExcelService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=monthly-report.xlsx"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportInventoryExcelController =
  async (

    req: Request<
      {},
      {},
      {},
      InventoryExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        inventoryExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportInventoryExcelService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=inventory-report.xlsx"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportSalesHistoryExcelController =
  async (

    req: Request<
      {},
      {},
      {},
      SalesHistoryExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        salesHistoryExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportSalesHistoryExcelService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=sales-history.xlsx"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportSettlementPdfController =
  async (

    req: Request<
      {},
      {},
      {},
      SettlementExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        settlementExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportSettlementPdfService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/pdf"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=settlement-report.pdf"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportMonthlyReportPdfController =
  async (

    req: Request<
      {},
      {},
      {},
      MonthlyReportExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        monthlyReportExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportMonthlyReportPdfService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/pdf"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=monthly-report.pdf"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const exportSalesHistoryPdfController =
  async (

    req: Request<
      {},
      {},
      {},
      SalesHistoryExportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        salesHistoryExportValidation(
          req.query
        );

      if (
        errors.length > 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * EXPORT
       */
      const buffer =
        await exportSalesHistoryPdfService(
          req.query
        );

      /**
       * RESPONSE
       */
      res.setHeader(

        "Content-Type",

        "application/pdf"
      );

      res.setHeader(

        "Content-Disposition",

        "attachment; filename=sales-history.pdf"
      );

      return res.send(buffer);

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };