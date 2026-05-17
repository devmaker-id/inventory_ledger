import prisma from "../../src/config/prisma.js";

import {
  hashPassword,
} from "../../src/auth/auth.utils.js";

export const seedUsers = async () => {

  const roles = await prisma.role.findMany();

  const owner =
    roles.find((r) => r.name === "OWNER");

  const distributor =
    roles.find(
      (r) => r.name === "DISTRIBUTOR"
    );

  const retail =
    roles.find((r) => r.name === "RETAIL");

  if (
    !owner ||
    !distributor ||
    !retail
  ) {
    throw new Error("Roles not found");
  }

  const password =
    await hashPassword("123456");

  await prisma.users.createMany({
    data: [

      /**
       * OWNER
       */
      {
        name: "Main Owner",

        email: "owner@test.com",

        password,

        roleId: owner.id,
      },

      /**
       * DISTRIBUTOR
       */
      {
        name: "Distributor Bandung",

        email: "dist-bandung@test.com",

        password,

        roleId: distributor.id,
      },

      {
        name: "Distributor Jakarta",

        email: "dist-jakarta@test.com",

        password,

        roleId: distributor.id,
      },

      /**
       * RETAIL
       */
      {
        name: "Retail Cicaheum",

        email: "retail-cicaheum@test.com",

        password,

        roleId: retail.id,
      },

      {
        name: "Retail Antapani",

        email: "retail-antapani@test.com",

        password,

        roleId: retail.id,
      },

      {
        name: "Retail Bekasi",

        email: "retail-bekasi@test.com",

        password,

        roleId: retail.id,
      },
    ],

    skipDuplicates: true,
  });

  console.log("Users seeded 🚀");
};