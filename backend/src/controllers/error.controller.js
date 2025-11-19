import { verifyAccessToken } from "../utils/jwt.js";
import { logger } from "../utils/winston.js";

// Enhanced error handling middleware
export const errorHandling = (err, req, res, next) => {
  // Log the full error for debugging
  logger.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  // Handle specific error types
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      data: err.details || null,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Unauthorized",
      message: err.message,
      data: null,
    });
  }

  if (err.name === "ForbiddenError") {
    return res.status(403).json({
      error: "Forbidden",
      message: err.message,
      data: null,
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({
      error: "Not Found",
      message: err.message,
      data: null,
    });
  }

  // Default error handling
  const message = err.message.split(" - ")[1] || "Internal server error";
  return res.status(500).json({
    error: message,
    message: "Internal server error",
    data: null,
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
    data: null,
  });
};

// Improved authentication middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      errors: "No token provided",
      message: "Access token is required",
      data: null,
    });
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      errors: "Invalid token format",
      message: "Token format should be 'Bearer <token>'",
      data: null,
    });
  }
  
  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(401).json({
      errors: "Invalid token",
      message: "Provided token is invalid or expired",
      data: null,
    });
  }
  
  req.user = user;
  next();
};

// New authorization middleware for role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        errors: "Authentication required",
        message: "User not authenticated",
        data: null,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        errors: "Insufficient permissions",
        message: `Access denied. Required roles: ${roles.join(", ")}`,
        data: null,
      });
    }

    next();
  };
};

// Custom error classes for better error handling
export class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}