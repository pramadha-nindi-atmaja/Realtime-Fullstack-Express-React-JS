import prisma from "../utils/client.js";
import {
  generateAcessToken,
  generateRefreshToken,
  parseJWT,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { inputUserValidation } from "../validations/user.validation.js";
import { ValidationError, NotFoundError } from "../controllers/error.controller.js";

export const createUser = async (req, res, next) => {
  try {
    const { error, value } = inputUserValidation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: "failed",
        data: null,
      });
    }
    const user = await prisma.user.create({
      data: {
        ...value,
      },
    });
    return res.status(201).json({
      error: null,
      message: "success",
      data: user,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:createUser - " +
          error.message
      )
    );
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        uuid: true,
        name: true,
        address: true,
      },
    });
    
    return res.status(200).json({
      error: null,
      message: "success",
      data: users,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getAllUsers - " +
          error.message
      )
    );
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        address: true,
      },
    });
    
    if (!user) {
      throw new NotFoundError("User not found");
    }
    
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        error: "User not found",
        message: "failed",
        data: null,
      });
    }
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getUserById - " +
          error.message
      )
    );
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = inputUserValidation(req.body);
    
    if (error) {
      throw new ValidationError(error.details[0].message, error.details);
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
    });
    
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }
    
    const user = await prisma.user.update({
      where: {
        uuid: id,
      },
      data: {
        ...value,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        address: true,
      },
    });
    
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
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
        error: "User not found",
        message: "failed",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/user.controller.js:updateUser - " +
          error.message
      )
    );
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
    });
    
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }
    
    const user = await prisma.user.delete({
      where: {
        uuid: id,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        address: true,
      },
    });
    
    return res.status(200).json({
      error: null,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({
        error: "User not found",
        message: "failed",
        data: null,
      });
    }
    
    next(
      new Error(
        "Error in src/controllers/user.controller.js:deleteUser - " +
          error.message
      )
    );
  }
};

export const getAcessToken = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        uuid: id,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "user not found",
        message: "failed",
        data: null,
      });
    }
    // generate acess token
    user.uuid = "xxxxxxxxxxxxx";
    const acessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
      acessToken,
      refreshToken,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getAcessToken - " +
          error.message
      )
    );
  }
};

export const getRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        errors: "Invalid token",
        message: "No token provided",
        data: null,
      });
    }
    const verify = verifyRefreshToken(token);
    if (!verify) {
      return res.status(401).json({
        errors: "Invalid token",
        message: "Provided token is not valid",
        data: null,
      });
    }
    let data = parseJWT(token);
    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "user not found",
        message: "failed",
        data: null,
      });
    }
    user.uuid = "xxxxxxxxxxxxx";
    const acessToken = generateAcessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.status(200).json({
      error: null,
      message: "success",
      data: user,
      acessToken,
      refreshToken,
    });
  } catch (error) {
    next(
      new Error(
        "Error in src/controllers/user.controller.js:getRefreshToken - " +
          error.message
      )
    );
  }
};