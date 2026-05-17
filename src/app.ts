import express from "express";
import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import productRoutes from "./products/products.routes.js";
import categoryRoutes from "./categories/categories.routes.js";
import stockRoutes from "./stocks/stocks.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API running 🚀",
  });
});

app.use("/api/stocks", stockRoutes);

app.use("/users", usersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

export default app;