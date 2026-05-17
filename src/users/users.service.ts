import prisma from "../config/prisma.js";

import {
  UpdateUserBody,
  UserQuery,
} from "./users.types.js";

/**
 * GET ALL USERS
 */
export const getUsersService = async (
  query: UserQuery
) => {

  // 1. pagination
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  // 2. search query
  const search = query.search || "";

  // 3. get users
  const users = await prisma.users.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    skip,
    take: limit,

    orderBy: {
      id: "desc",
    },

    include: {
      role: true,
    },
  });

  // 4. count total
  const total = await prisma.users.count({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  // 5. return response
  return {
    data: users,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * GET USER DETAIL
 */
export const getUserByIdService = async (
  id: number
) => {

  const user = await prisma.users.findUnique({
    where: {
      id,
    },

    include: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

/**
 * UPDATE USER
 */
export const updateUserService = async (
  id: number,
  body: UpdateUserBody
) => {

  // cek user
  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // update user
  const updatedUser = await prisma.users.update({
    where: { id },

    data: {
      name: body.name,
      phone: body.phone,
      address: body.address,
    },
  });

  return updatedUser;
};

/**
 * DELETE USER
 */
export const deleteUserService = async (
  id: number
) => {

  // cek user
  const user = await prisma.users.findUnique({
    where: { id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // delete user
  await prisma.users.delete({
    where: { id },
  });

  return true;
};