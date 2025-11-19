import { Router } from "express";
import productRouter from "./product.route.js";
import { errorHandling, notFound } from "../controllers/error.controller.js";
import userRouter from "./user.router.js";

const app = Router();

// API routes
app.use("/api", productRouter);
app.use("/api", userRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    error: null,
    message: "Server is running",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    }
  });
});

// API documentation endpoint
app.get("/api/docs", (req, res) => {
  res.status(200).json({
    error: null,
    message: "API Documentation",
    data: {
      endpoints: {
        products: {
          get: "/api/products - Get all products",
          getById: "/api/products/:id - Get product by ID",
          post: "/api/products - Create a new product",
          put: "/api/products/:id - Update a product",
          delete: "/api/products/:id - Delete a product"
        },
        users: {
          post: "/api/users - Create a new user",
          get: "/api/users - Get all users (authenticated)",
          getById: "/api/users/:id - Get user by ID (authenticated)",
          put: "/api/users/:id - Update user (authenticated)",
          delete: "/api/users/:id - Delete user (admin only)",
          getToken: "/api/users/:id/token - Get access token",
          refreshToken: "/api/refresh - Refresh token"
        },
        health: "/health - Server health check",
        docs: "/api/docs - API documentation"
      }
    }
  });
});

// Enhanced error handling
app.use("*", errorHandling);
app.use("*", notFound);

export default app;