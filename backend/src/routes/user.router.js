import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAcessToken,
  getRefreshToken,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../controllers/error.controller.js";

const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.get("/users", authenticate, getAllUsers);
userRouter.get("/users/:id", authenticate, getUserById);
userRouter.put("/users/:id", authenticate, updateUser);
userRouter.delete("/users/:id", authenticate, authorize('admin'), deleteUser);
userRouter.get("/users/:id/token", getAcessToken);
userRouter.get("/refresh", getRefreshToken);

export default userRouter;