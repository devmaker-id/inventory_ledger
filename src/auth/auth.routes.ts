import { Router } from "express";
import {
  loginController,
  registerController,
} from "./auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/login", loginController);
/**
 * REGISTER
 */
router.post(
  "/register",
  registerController
);

/**
 * PROFILE
 * semua user login boleh akses
 */
router.get(
  "/profile",
  verifyToken,
  (req, res) => {
    return res.json({
      message: "Profile success",
      user: req.user,
    });
  }
);

/**
 * OWNER ONLY
 */
router.get(
  "/admin",
  verifyToken,
  authorizeRoles("OWNER"),
  (req, res) => {
    return res.json({
      message: "Welcome OWNER",
      user: req.user,
    });
  }
);

/**
 * OWNER + DISTRIBUTOR
 */
router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles("OWNER", "DISTRIBUTOR"),
  (req, res) => {
    return res.json({
      message: "Dashboard access success",
      user: req.user,
    });
  }
);

export default router;