import { NextFunction, Request, Response } from "express";

/**
 * AUTHORIZE ROLE
 */
export const authorizeRoles = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    // 1. cek user login
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 2. cek role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 3. lanjut
    next();
  };
};