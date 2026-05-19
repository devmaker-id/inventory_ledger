import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../auth/auth.types.js";

/**
 * VERIFY JWT TOKEN
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. ambil authorization header
    const authHeader = req.headers.authorization;

    // 2. cek apakah header ada
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**
     * format:
     * Bearer TOKEN
     */
    const parts = authHeader.split(" ");
    //invalid format
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }
    //token
    const token = parts[1];

    // 4. verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 5. simpan user ke request
    req.user = decoded;

    // 6. lanjut ke next middleware/controller
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};