import { Router } from "express";

import {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./products.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/**
 * PUBLIC
 */
router.get("/", getProductsController);
router.get("/:id", getProductByIdController);

/**
 * PROTECTED
 */
router.use(verifyToken);
router.use(authorizeRoles("OWNER", "DISTRIBUTOR"));

router.post("/", upload.single("image"), createProductController);
router.put("/:id", updateProductController);
router.delete("/:id", deleteProductController);

export default router;