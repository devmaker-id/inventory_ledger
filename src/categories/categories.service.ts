import prisma from "../config/prisma.js";

export const createCategoryService = async (name: string) => {
  return await prisma.category.create({
    data: { name },
  });
};

export const getCategoriesService = async () => {
  return await prisma.category.findMany({
    orderBy: { id: "desc" },
  });
};