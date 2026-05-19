import express from "express";
import cors from "cors";

import authRoutes from "./auth/auth.routes.js";
import usersRoutes from "./users/users.routes.js";
import productRoutes from "./products/products.routes.js";
import categoryRoutes from "./categories/categories.routes.js";
import stockRoutes from "./stocks/stocks.routes.js";
import analyticsRoutes from "./analytics/analytics.routes.js";
import exportsRoutes from "./exports/exports.routes.js";

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/users", usersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/exports", exportsRoutes);

export default app;
