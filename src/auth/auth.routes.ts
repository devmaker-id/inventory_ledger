import { Router } from "express";
import {
  loginController,
  profileController,
  registerController,
} from "./auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
// import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

router.get("/profile", verifyToken, profileController);

/**
 * OWNER ONLY koding upgrade
 */
// router.get(
//   "/admin",
//   verifyToken,
//   authorizeRoles("OWNER"),
//   (req, res) => {
//     return res.json({
//       message: "Welcome OWNER",
//       user: req.user,
//     });
//   }
// );

/**
 * OWNER + DISTRIBUTOR koding upgrade
 */
// router.get(
//   "/dashboard",
//   verifyToken,
//   authorizeRoles("OWNER", "DISTRIBUTOR"),
//   (req, res) => {
//     return res.json({
//       message: "Dashboard access success",
//       user: req.user,
//     });
//   }
// );

export default router;