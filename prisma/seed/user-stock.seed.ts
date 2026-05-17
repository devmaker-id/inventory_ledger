import prisma from "../../src/config/prisma.js";

export const seedUserStocks = async () => {

  const users =
    await prisma.users.findMany();

  const products =
    await prisma.products.findMany();

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

  const stocks = [];

  for (const product of products) {

    stocks.push({
      userId: owner.id,

      productId: product.id,

      qty: 1000,
    });
  }

  await prisma.userStocks.createMany({
    data: stocks,

    skipDuplicates: true,
  });

  console.log(
    "User stocks seeded 🚀"
  );
};