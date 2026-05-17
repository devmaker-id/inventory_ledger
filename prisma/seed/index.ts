import { seedRoles }
from "./role.seed.js";

import { seedUsers }
from "./user.seed.js";

import { seedCategories }
from "./category.seed.js";

import { seedProducts }
from "./product.seed.js";

import { seedUserStocks }
from "./user-stock.seed.js";

async function main() {

  // 1. roles
  await seedRoles();

  // 2. users
  await seedUsers();

  // 3. categories
  await seedCategories();

  // 4. products
  await seedProducts();

  // 5. owner stocks
  await seedUserStocks();
}

main()
  .catch((e) => {

    console.error(e);

    process.exit(1);

  })

  .finally(async () => {

    const prisma =
      (
        await import(
          "../../src/config/prisma.js"
        )
      ).default;

    await prisma.$disconnect();
  });