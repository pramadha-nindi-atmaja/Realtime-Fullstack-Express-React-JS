import prisma from "../utils/client.js";
import { inputOrderValidation, updateOrderValidation } from "../validations/order.validation.js";
import { ValidationError, NotFoundError } from "../controllers/error.controller.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const data = await prisma.order.findMany({
      select: {
        id: true,
        productId: true,
        qty: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            name: true,
            price: true
          }
        }
      },
    });
    
    // Check if data array is empty
    if (data.length === 0) {
      return res.status(200).json({
        error: null,
        message: "No orders found",
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
        "Error in src/controllers/order.controller.js:getAllOrders - " +
          error.message
      )
    );
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid order ID format", [{ message: "Order ID must be a number" }]);
    }
    
    const data = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        productId: true,
        qty: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            name: true,
            price: true
          }
        }
      },
    });
    
    if (!data) {
      throw new NotFoundError("Order not found");
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
        error: "Order not found",
        message: "Order with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/order.controller.js:getOrderById - " +
          error.message
      )
    );
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { error, value } = inputOrderValidation(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message, error.details);
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: Number(value.productId),
      },
    });
    
    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }
    
    const data = await prisma.order.create({
      data: {
        ...value,
        status: "pending"
      },
      select: {
        id: true,
        productId: true,
        qty: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return res.status(201).json({
      error: null,
      message: "Order created successfully",
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
        "Error in src/controllers/order.controller.js:createOrder - " +
          error.message
      )
    );
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid order ID format", [{ message: "Order ID must be a number" }]);
    }
    
    const { error, value } = updateOrderValidation(req.body);
    if (error) {
      throw new ValidationError(error.details[0].message, error.details);
    }
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingOrder) {
      throw new NotFoundError("Order not found");
    }
    
    // If productId is provided, check if product exists
    if (value.productId) {
      const existingProduct = await prisma.product.findUnique({
        where: {
          id: Number(value.productId),
        },
      });
      
      if (!existingProduct) {
        throw new NotFoundError("Product not found");
      }
    }
    
    const data = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        ...value,
      },
      select: {
        id: true,
        productId: true,
        qty: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.status(200).json({
      error: null,
      message: "Order updated successfully",
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
        error: error.message,
        message: "Resource with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/order.controller.js:updateOrder - " +
          error.message
      )
    );
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a number
    if (isNaN(id)) {
      throw new ValidationError("Invalid order ID format", [{ message: "Order ID must be a number" }]);
    }
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    
    if (!existingOrder) {
      throw new NotFoundError("Order not found");
    }
    
    const data = await prisma.order.delete({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        productId: true,
        qty: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    res.status(200).json({
      error: null,
      message: "Order deleted successfully",
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
        error: "Order not found",
        message: "Order with the specified ID does not exist",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/order.controller.js:deleteOrder - " +
          error.message
      )
    );
  }
};