import { Request, Response } from "express";
import {
  createCategoryService,
  getCategoriesService,
} from "./categories.service.js";

export const createCategoryController = async (
  req: Request<{}, {}, { name: string }>,
  res: Response
) => {
  try {
    const category = await createCategoryService(req.body.name);

    res.json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await getCategoriesService();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};