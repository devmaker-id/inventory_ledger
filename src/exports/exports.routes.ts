import { Router }
from "express";

import {
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

import {
  exportSettlementExcelController,
  exportMonthlyReportExcelController,
  exportInventoryExcelController,
  exportSalesHistoryExcelController,
  exportSettlementPdfController,
  exportMonthlyReportPdfController,
  exportSalesHistoryPdfController,
} from "./exports.controller.js";

const router = Router();

/**
 * PROTECTED
 */
router.use(verifyToken);

/**
 * EXPORT SETTLEMENT
 */
router.get(
  "/settlement-excel",
  authorizeRoles(
    "OWNER"
  ),
  exportSettlementExcelController
);

router.get(
  "/monthly-report-excel",
  authorizeRoles(
    "OWNER"
  ),
  exportMonthlyReportExcelController
);

router.get(
  "/inventory-excel",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  exportInventoryExcelController
);

router.get(
  "/sales-history-excel",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  exportSalesHistoryExcelController
);

router.get(
  "/settlement-pdf",
  authorizeRoles(
    "OWNER"
  ),
  exportSettlementPdfController
);

router.get(
  "/monthly-report-pdf",
  authorizeRoles(
    "OWNER"
  ),
  exportMonthlyReportPdfController
);

router.get(
  "/sales-history-pdf",
  authorizeRoles(
    "OWNER",
    "DISTRIBUTOR"
  ),
  exportSalesHistoryPdfController
);

export default router;