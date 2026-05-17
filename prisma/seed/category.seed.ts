import prisma from "../../src/config/prisma.js";

export const seedCategories = async () => {

  await prisma.category.createMany({
    data: [

      {
        name: "Voucher WiFi",
      },

      {
        name: "Voucher Hotspot",
      },

      {
        name: "Internet Package",
      },
    ],

    skipDuplicates: true,
  });

  console.log(
    "Categories seeded 🚀"
  );
};