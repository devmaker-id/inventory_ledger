import { Request, Response } from "express";
import prisma from "../config/prisma.js";

import {
  loginService,
  registerService,
} from "./auth.service.js";

import {
  LoginBody,
  RegisterBody,
} from "./auth.types.js";

/**
 * LOGIN CONTROLLER
 */

export const loginController = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    // LOGIN
    const result = await loginService(req.body);

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login success",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
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

// PROFILE CONTROLLER
export const profileController = async(
  req: Request,
  res: Response
) => {
  try {
    // user id
    const userId = req.user.id;

    // get user
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // response
    return res.status(200).json({
      success: true,
      message: "Profile success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        parentId: user.parentId,
        parent: user.parent,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Profile filed",
    });
  }
};