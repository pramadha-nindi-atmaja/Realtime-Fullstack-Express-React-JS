import "dotenv/config";
import web from "./middleware/web.js";
import { logger } from "./utils/winston.js";

// Get port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Graceful shutdown handling
const server = web.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  console.log(`Listening on http://localhost:${PORT}`);
});

// Handle graceful shutdown
const shutdown = () => {
  logger.info("Shutting down server...");
  server.close(() => {
    logger.info("Server closed successfully");
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

// Handle different shutdown signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export default server;