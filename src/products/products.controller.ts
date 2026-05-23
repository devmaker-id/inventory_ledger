import { Request, Response } from "express";
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "./products.service.js";
import { createProductValidation } from "./products.validation.js";

import { ProductQuery, CreateProductBody, UpdateProductBody } from "./products.types.js";

export const createProductController = async (
  req: Request<{}, {}, CreateProductBody>,
  res: Response
) => {
  try {
    const userId = req.user.id as number;
    // const image = req.file?.filename;

    const errors = createProductValidation(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const product = await createProductService(
      req.body,
      userId,
      // image
    );

    return res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductsController = async (
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response
) => {
  try {
    const result = await getProductsService(req.query);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const product = await getProductByIdService(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProductController = async (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response
) => {
  try {
    const product = await getProductByIdService(
      Number(req.params.id)
    );

    if (
      product.createdBy !== req.user.id &&
      req.user?.role !== "OWNER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const updated = await updateProductService(
      Number(req.params.id),
      req.body
    );

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProductController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const product = await getProductByIdService(
      Number(req.params.id)
    );

    if (
      product.createdBy !== req.user.id &&
      req.user?.role !== "OWNER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await deleteProductService(Number(req.params.id));

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};