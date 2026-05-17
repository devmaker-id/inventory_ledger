import { Request, Response } from "express";
import {
  loginService,
  registerService,
} from "./auth.service.js";

import {
  LoginBody,
  RegisterBody,
} from "./auth.types.js";

export const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      message: "Login success",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * REGISTER CONTROLLER
 */
export const registerController = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {

    // 1. ambil body request
    const body = req.body;

    // 2. register user
    const result = await registerService(body);

    // 3. response success
    return res.status(201).json({
      success: true,
      message: "Register success",
      data: result,
    });

  } catch (error) {

    // 4. response error
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Register failed",
    });
  }
};