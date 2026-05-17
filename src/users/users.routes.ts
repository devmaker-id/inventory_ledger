import { Router } from "express";

import {
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from "./users.controller.js";

import {
  verifyToken,
} from "../middlewares/auth.middleware.js";

import {
  authorizeRoles,
} from "../middlewares/role.middleware.js";

const router = Router();

/**
 * PROTECT ALL ROUTES
 */
router.use(verifyToken);

/**
 * SUPER ADMIN ONLY
 */
router.use(authorizeRoles("OWNER"));

/**
 * GET USERS
 */
router.get(
  "/",
  getUsersController
);

/**
 * GET USER DETAIL
 */
router.get(
  "/:id",
  getUserByIdController
);

/**
 * UPDATE USER
 */
router.put(
  "/:id",
  updateUserController
);

/**
 * DELETE USER
 */
router.delete(
  "/:id",
  deleteUserController
);

export default router;