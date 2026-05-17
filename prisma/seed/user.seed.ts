import prisma from "../../src/config/prisma.js";

import {
  hashPassword,
} from "../../src/auth/auth.utils.js";

export const seedUsers = async () => {

  /**
   * GET ROLES
   */
  const roles = await prisma.role.findMany();

  const owner =
    roles.find(
      (r) => r.name === "OWNER"
    );

  const distributor =
    roles.find(
      (r) =>
        r.name === "DISTRIBUTOR"
    );

  const retail =
    roles.find(
      (r) => r.name === "RETAIL"
    );

  if (
    !owner ||
    !distributor ||
    !retail
  ) {

    throw new Error(
      "Roles not found"
    );
  }

  /**
   * HASH PASSWORD
   */
  const password =
    await hashPassword(
      "123456"
    );

  /**
   * OWNER
   */
  const ownerUser =
    await prisma.users.upsert({

      where: {
        email:
          "owner@test.com",
      },

      update: {},

      create: {

        name:
          "Main Owner",

        email:
          "owner@test.com",

        password,

        roleId:
          owner.id,
      },
    });

  /**
   * DISTRIBUTOR BANDUNG
   */
  const distributorBandung =
    await prisma.users.upsert({

      where: {

        email:
          "dist-bandung@test.com",
      },

      update: {},

      create: {

        name:
          "Distributor Bandung",

        email:
          "dist-bandung@test.com",

        password,

        roleId:
          distributor.id,

        parentId:
          ownerUser.id,
      },
    });

  /**
   * DISTRIBUTOR JAKARTA
   */
  const distributorJakarta =
    await prisma.users.upsert({

      where: {

        email:
          "dist-jakarta@test.com",
      },

      update: {},

      create: {

        name:
          "Distributor Jakarta",

        email:
          "dist-jakarta@test.com",

        password,

        roleId:
          distributor.id,

        parentId:
          ownerUser.id,
      },
    });

  /**
   * RETAIL BANDUNG
   */
  await prisma.users.upsert({

    where: {

      email:
        "retail-cicaheum@test.com",
    },

    update: {},

    create: {

      name:
        "Retail Cicaheum",

      email:
        "retail-cicaheum@test.com",

      password,

      roleId:
        retail.id,

      parentId:
        distributorBandung.id,
    },
  });

  await prisma.users.upsert({

    where: {

      email:
        "retail-antapani@test.com",
    },

    update: {},

    create: {

      name:
        "Retail Antapani",

      email:
        "retail-antapani@test.com",

      password,

      roleId:
        retail.id,

      parentId:
        distributorBandung.id,
    },
  });

  /**
   * RETAIL JAKARTA
   */
  await prisma.users.upsert({

    where: {

      email:
        "retail-bekasi@test.com",
    },

    update: {},

    create: {

      name:
        "Retail Bekasi",

      email:
        "retail-bekasi@test.com",

      password,

      roleId:
        retail.id,

      parentId:
        distributorJakarta.id,
    },
  });

  console.log(
    "Users seeded 🚀"
  );
};