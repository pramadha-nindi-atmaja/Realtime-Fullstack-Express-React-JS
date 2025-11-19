import prisma from "../utils/client.js";
import { inputProductValidation } from "../validations/product.validation.js";
import { ValidationError, NotFoundError } from "../controllers/error.controller.js";

export const getAllProduct = async (req, res, next) => {
  try {
    const data = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    // Check if data array is empty
    if (data.length === 0) {
      return res.status(200).json({
        error: null,
        message: "No products found",
        data: [],
      });
    }
    
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/product.controller.js:getAllProduct - " +
          error.message
      )
    );
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid product ID format", [{ message: "Product ID must be a number" }]);
    }
    
    const data = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!data) {
      throw new NotFoundError("Product not found");
    }
    
    res.status(200).json({
      error: null,
      message: "success",
      data,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        data: error.details || null,
      });
    }
    
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        error: "Product not found",
        message: "Product with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/product.controller.js:getProductById - " +
          error.message
      )
    );
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { error, value } = inputProductValidation(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message, error.details);
    }
    
    const data = await prisma.product.create({
      data: {
        ...value,
      },
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return res.status(201).json({
      error: null,
      message: "Product created successfully",
      data,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        data: error.details || null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/product.controller.js:createProduct - " +
          error.message
      )
    );
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid product ID format", [{ message: "Product ID must be a number" }]);
    }
    
    const { error, value } = inputProductValidation(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message, error.details);
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }
    
    const data = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        ...value,
      },
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.status(200).json({
      error: null,
      message: "Product updated successfully",
      data,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        data: error.details || null,
      });
    }
    
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        error: "Product not found",
        message: "Product with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/product.controller.js:updateProduct - " +
          error.message
      )
    );
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid product ID format", [{ message: "Product ID must be a number" }]);
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }
    
    const data = await prisma.product.delete({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        name: true,
        qty: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.status(200).json({
      error: null,
      message: "Product deleted successfully",
      data,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: error.message,
        data: error.details || null,
      });
    }
    
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        error: "Product not found",
        message: "Product with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/product.controller.js:deleteProduct - " +
          error.message
      )
    );
  }
};