import prisma from "../../src/config/prisma.js";

export const seedProducts = async () => {

  const categories =
    await prisma.category.findMany();

  const users =
    await prisma.users.findMany();

  const owner =
    users.find(
      (u) =>
        u.email === "owner@test.com"
    );

  if (!owner) {
    throw new Error(
      "Owner not found"
    );
  }

  const voucherCategory =
    categories.find(
      (c) =>
        c.name === "Voucher WiFi"
    );

  if (!voucherCategory) {
    throw new Error(
      "Voucher category not found"
    );
  }

  await prisma.products.createMany({
    data: [

      {
        name: "Voucher 2000",

        description:
          "Voucher WiFi Rp 2000",

        basePrice: 1000,

        categoryId:
          voucherCategory.id,

        createdBy: owner.id,
      },

      {
        name: "Voucher 3000",

        description:
          "Voucher WiFi Rp 3000",

        basePrice: 2000,

        categoryId:
          voucherCategory.id,

        createdBy: owner.id,
      },

      {
        name: "Voucher 5000",

        description:
          "Voucher WiFi Rp 5000",

        basePrice: 3500,

        categoryId:
          voucherCategory.id,

        createdBy: owner.id,
      },
    ],

    skipDuplicates: true,
  });

  console.log(
    "Products seeded 🚀"
  );
};