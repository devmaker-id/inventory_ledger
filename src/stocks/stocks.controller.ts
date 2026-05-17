import {
  Request,
  Response,
} from "express";

import {
  transferStockService,
  getMyStocksService,
  getStockHistoryService,
  returnStockService,
  adjustmentStockService,
  saleStockService,
  getSalesSummaryService,
  getSalesHistoryService,
} from "./stocks.service.js";

import {
  transferStockValidation,
  saleStockValidation,
} from "./stocks.validation.js";

import {
  AdjustmentStockBody,
  ReturnStockBody,
  TransferStockBody,
  SaleStockBody,
  SalesHistoryQuery,
} from "./stocks.types.js";

export const transferStockController =
  async (
    req: Request<
      {},
      {},
      TransferStockBody
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        transferStockValidation(
          req.body
        );

      if (errors.length > 0) {

        return res.status(400).json({
          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * CURRENT LOGIN USER
       */
      const fromUserId =
        req.user?.userId as number;

      /**
       * TRANSFER STOCK
       */
      await transferStockService(
        fromUserId,
        req.body
      );

      return res.json({
        success: true,

        message:
          "Stock transferred successfully",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

  export const getMyStocksController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const userId =
        req.user?.userId as number;

      const stocks =
        await getMyStocksService(
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

export const getStockHistoryController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const userId =
        req.user?.userId as number;

      const histories =
        await getStockHistoryService(
          userId
        );

      return res.json({
        success: true,

        data: histories,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

export const returnStockController =
  async (
    req: Request<
      {},
      {},
      ReturnStockBody
    >,

    res: Response
  ) => {

    try {

      const fromUserId =
        req.user?.userId as number;

      await returnStockService(
        fromUserId,
        req.body
      );

      return res.json({
        success: true,

        message:
          "Stock returned successfully",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
};

export const adjustmentStockController =
  async (
    req: Request<
      {},
      {},
      AdjustmentStockBody
    >,

    res: Response
  ) => {

    try {

      await adjustmentStockService(
        req.body
      );

      return res.json({
        success: true,

        message:
          "Stock adjusted successfully",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

export const saleStockController =
  async (
    req: Request<
      {},
      {},
      SaleStockBody
    >,

    res: Response
  ) => {

    try {

      /**
       * VALIDATION
       */
      const errors =
        saleStockValidation(
          req.body
        );

      if (errors.length > 0) {

        return res.status(400).json({
          success: false,

          message:
            "Validation error",

          errors,
        });
      }

      /**
       * CURRENT USER
       */
      const userId =
        req.user?.userId as number;

      /**
       * PROCESS SALE
       */
      await saleStockService(
        userId,
        req.body
      );

      return res.json({
        success: true,

        message:
          "Sale success",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

export const getSalesSummaryController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const summary =
        await getSalesSummaryService();

      return res.json({
        success: true,

        data: summary,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };

export const getSalesHistoryController =
  async (
    req: Request<
      {},
      {},
      {},
      SalesHistoryQuery
    >,

    res: Response
  ) => {

    try {

      const result =
        await getSalesHistoryService(
          req.query
        );

      return res.json({
        success: true,

        ...result,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };