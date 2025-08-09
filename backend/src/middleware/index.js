import express from "express";
import "../utils/winston.js";
import cors from "cors";
import app from "../routes/index.js";

const appMiddleware = express();

appMiddleware.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

appMiddleware.options("*", cors());
appMiddleware.use(express.json());
appMiddleware.use(app);

export default appMiddleware;
