import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares";
import AuthRouter from "./routes/v1/auth.router";
import loggerMiddleware from "./middlewares/logger-handler";

const app = express();

// =======================
// Global Middlewares
// =======================

// Access Request Body (JSON)
app.use(express.json());

// Logger
app.use(loggerMiddleware);

// ========================
// Global API V1
// ========================
app.use("/v1", AuthRouter);

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

export default app;
