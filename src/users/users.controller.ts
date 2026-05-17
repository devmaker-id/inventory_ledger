import { Request, Response } from "express";

import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService,
} from "./users.service.js";

import {
  UpdateUserBody,
  UserQuery,
} from "./users.types.js";

/**
 * GET USERS
 */
export const getUsersController = async (
  req: Request<{}, {}, {}, UserQuery>,
  res: Response
) => {
  try {

    const result = await getUsersService(
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Get users success",
      data: result,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Get users failed",
    });
  }
};

/**
 * GET USER DETAIL
 */
export const getUserByIdController = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const result =
      await getUserByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Get user success",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Get user failed",
    });
  }
};

/**
 * UPDATE USER
 */
export const updateUserController = async (
  req: Request<{ id: string }, {}, UpdateUserBody>,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    const result =
      await updateUserService(
        id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Update user success",
      data: result,
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Update user failed",
    });
  }
};

/**
 * DELETE USER
 */
export const deleteUserController = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id);

    await deleteUserService(id);

    return res.status(200).json({
      success: true,
      message: "Delete user success",
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Delete user failed",
    });
  }
};