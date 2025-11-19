import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../controllers/error.controller.js";

const productRouter = Router();

// Product routes with authentication
productRouter.get("/products", authenticate, getAllProduct);
productRouter.get("/products/:id", authenticate, getProductById);
productRouter.post("/products", authenticate, createProduct);
productRouter.put("/products/:id", authenticate, updateProduct);
productRouter.delete("/products/:id", authenticate, deleteProduct);

// Product search endpoint
productRouter.get("/products/search/:query", authenticate, async (req, res, next) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // In a real implementation, this would call a controller function
    // For now, we're sending a placeholder response
    res.status(200).json({
      error: null,
      message: "Search endpoint ready",
      data: {
        query,
        page: parseInt(page),
        limit: parseInt(limit),
        results: []
      }
    });
  } catch (error) {
    next(error);
  }
});

export default productRouter;