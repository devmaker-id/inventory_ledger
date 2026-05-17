import prisma from "../../src/config/prisma.js";

export const seedRoles = async () => {

  await prisma.role.createMany({
    data: [
      {
        name: "OWNER",
        level: 1,
      },

      {
        name: "DISTRIBUTOR",
        level: 2,
      },

      {
        name: "RETAIL",
        level: 3,
      },
    ],

    skipDuplicates: true,
  });

  console.log("Roles seeded 🚀");
};