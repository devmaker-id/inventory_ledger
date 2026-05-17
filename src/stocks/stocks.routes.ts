import { Router } from "express";

import {
  transferStockController,
  getMyStocksController,
  getStockHistoryController,
  returnStockController,
  adjustmentStockController,
  saleStockController,
  getSalesSummaryController,
  getSalesHistoryController,
  getDistributorSummaryController,
  getRetailSummaryController,
  getTopProductsController,
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
 * GET MY STOCKS
 */
router.get(
  "/me",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR",
    "RETAIL"
  ),
  getMyStocksController
);

/**
 * GET STOCK HISTORY
 */
router.get(
  "/history",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR",
    "RETAIL"
  ),
  getStockHistoryController
);

/**
 * TRANSFER STOCK
 */
router.post(
  "/transfer",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  transferStockController
);

/**
 * RETURN STOCK
 */
router.post(
  "/return",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  returnStockController
);

/**
 * STOCK ADJUSTMENT
 */
router.post(
  "/adjustment",
  authorizeRoles(
    "OWNER"
  ),
  adjustmentStockController
);

/**
 * SALE STOCK
 */
router.post(
  "/sale",
  authorizeRoles(
    "RETAIL"
  ),
  saleStockController
);

router.get(
  "/sales-summary",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getSalesSummaryController
);

router.get(
  "/sales",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getSalesHistoryController
);

router.get(
  "/distributor-summary",
  authorizeRoles(
    "OWNER"
  ),
  getDistributorSummaryController
);

router.get(
  "/retail-summary",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getRetailSummaryController
);

router.get(
  "/top-products",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getTopProductsController
);
export default router;