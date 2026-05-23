import { Router }
from "express";

import {
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

import {
  getSummaryController,
  getSalesChartController,
  getDailyReportController,
  getMonthlyReportController,
  getLowStockController,
  getRecentTransactionsController,
} from "./analytics.controller.js";

const router = Router();

/**
 * PROTECTED
 */
router.use(verifyToken);

router.get(
  "/summary",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getSummaryController
);

/**
 * SALES CHART
 */
router.get(
  "/sales-chart",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getSalesChartController
);

router.get(
  "/daily-report",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getDailyReportController
);

router.get(
  "/monthly-report",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getMonthlyReportController
);

router.get(
  "/low-stock",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getLowStockController
);

router.get(
  "/recent-transactions",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  getRecentTransactionsController
);

export default router;