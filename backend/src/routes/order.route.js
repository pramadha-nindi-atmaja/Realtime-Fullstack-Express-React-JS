import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.get("/orders", getAllOrders);
orderRouter.get("/orders/:id", getOrderById);
orderRouter.post("/orders", createOrder);
orderRouter.put("/orders/:id", updateOrder);
orderRouter.delete("/orders/:id", deleteOrder);

export default orderRouter;