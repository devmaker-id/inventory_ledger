import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
} from "./categories.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

/**
 * PUBLIC
 */
router.get("/", getCategoriesController);

/**
 * PRIVATE (OWNER ONLY)
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles("OWNER"),
  createCategoryController
);

export default router;