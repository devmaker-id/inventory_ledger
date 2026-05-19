import {
  Request,
  Response,
} from "express";

import {
  getSalesChartService,
  getDailyReportService,
  getMonthlyReportService,
  getLowStockService,
  getRecentTransactionsService,
} from "./analytics.service.js";

import {
  SalesChartQuery,
  DailyReportQuery,
  MonthlyReportQuery,
  LowStockQuery,
  RecentTransactionQuery,
} from "./analytics.types.js";

import {
  salesChartValidation,
  dailyReportValidation,
  monthlyReportValidation,
  lowStockValidation,
  recentTransactionValidation,
} from "./analytics.validation.js";

export const getSalesChartController =
  async (

    req: Request<
      {},
      {},
      {},
      SalesChartQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        salesChartValidation(
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
       * SERVICE
       */
      const chart =
        await getSalesChartService(
          req.query
        );

      return res.json({

        success: true,

        data: chart,
      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

  export const getDailyReportController =
  async (

    req: Request<
      {},
      {},
      {},
      DailyReportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        dailyReportValidation(
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
       * SERVICE
       */
      const report =
        await getDailyReportService(
          req.query
        );

      return res.json({

        success: true,

        data: report,
      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

  export const getMonthlyReportController =
  async (

    req: Request<
      {},
      {},
      {},
      MonthlyReportQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        monthlyReportValidation(
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
       * SERVICE
       */
      const report =
        await getMonthlyReportService(
          req.query
        );

      return res.json({

        success: true,

        data: report,
      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

  export const getLowStockController =
  async (

    req: Request<
      {},
      {},
      {},
      LowStockQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        lowStockValidation(
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
       * SERVICE
       */
      const stocks =
        await getLowStockService(
          req.query
        );

      return res.json({

        success: true,

        data: stocks,
      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };

export const getRecentTransactionsController =
  async (

    req: Request<
      {},
      {},
      {},
      RecentTransactionQuery
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        recentTransactionValidation(
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
       * SERVICE
       */
      const transactions =
        await getRecentTransactionsService(
          req.query
        );

      return res.json({

        success: true,

        data: transactions,
      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  };