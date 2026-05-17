import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export const createProductService = async (
  body: any,
  userId: number,
  image?: string
) => {

  return await prisma.products.create({
    data: {
      name: body.name,

      description: body.description,

      basePrice: Number(body.basePrice),

      categoryId: Number(body.categoryId),

      createdBy: userId,

      image: image || null,
    },
  });
};

export const getProductsService = async (
  query: any
) => {

  const page =
    Number(query.page) || 1;

  const limit =
    Number(query.limit) || 10;

  const skip =
    (page - 1) * limit;

  const search =
    query.search || "";

  const whereCondition = {
    name: {
      contains: search,

      mode: Prisma.QueryMode.insensitive,
    },
  };

  const products =
    await prisma.products.findMany({

      where: whereCondition,

      skip,

      take: limit,

      include: {
        category: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        id: "desc",
      },
    });

  const total =
    await prisma.products.count({
      where: whereCondition,
    });

  return {
    data: products,

    pagination: {
      total,
      page,
      limit,

      totalPages:
        Math.ceil(total / limit),
    },
  };
};

export const getProductByIdService = async (
  id: number
) => {

  const product =
    await prisma.products.findUnique({

      where: { id },

      include: {
        category: true,

        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  return product;
};

export const updateProductService = async (
  id: number,
  body: any
) => {

  const product =
    await prisma.products.findUnique({
      where: { id },
    });

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  return await prisma.products.update({
    where: { id },

    data: {
      name: body.name,

      description:
        body.description,

      basePrice:
        body.basePrice
          ? Number(body.basePrice)
          : undefined,

      categoryId:
        body.categoryId
          ? Number(body.categoryId)
          : undefined,

      image: body.image,
    },
  });
};

export const deleteProductService = async (
  id: number
) => {

  const product =
    await prisma.products.findUnique({
      where: { id },
    });

  if (!product) {
    throw new Error(
      "Product not found"
    );
  }

  await prisma.products.delete({
    where: { id },
  });

  return true;
};