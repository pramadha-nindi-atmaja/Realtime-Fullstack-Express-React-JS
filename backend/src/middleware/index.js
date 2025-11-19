import express from "express";
import "../utils/winston.js";
import cors from "cors";
import app from "../routes/index.js";
import { errorHandling, notFound } from "../controllers/error.controller.js";
import { logger } from "../utils/winston.js";

const appMiddleware = express();

// Enhanced CORS configuration
appMiddleware.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

// Parse JSON bodies
appMiddleware.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
appMiddleware.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
appMiddleware.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  });
  next();
});

// Rate limiting middleware
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // Max requests per window

appMiddleware.use((req, res, next) => {
  const clientId = req.ip;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, {
      requests: 1,
      startTime: now,
    });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientId);
  
  // Reset window if expired
  if (now - clientData.startTime > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(clientId, {
      requests: 1,
      startTime: now,
    });
    return next();
  }
  
  // Increment request count
  clientData.requests += 1;
  
  // Check if limit exceeded
  if (clientData.requests > RATE_LIMIT_MAX) {
    logger.warn(`Rate limit exceeded for IP: ${clientId}`);
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      data: null,
    });
  }
  
  next();
});

// Main application routes
appMiddleware.use(app);

// Enhanced 404 handler
appMiddleware.use("*", notFound);

// Enhanced error handler
appMiddleware.use("*", errorHandling);

export default appMiddleware;