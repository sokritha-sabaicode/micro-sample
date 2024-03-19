import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares";
import AuthRouter from "./routes/auth.router";

const app = express();

// Global Middlewares
app.use(express.json());

// Global API
app.use("/auth/v1", AuthRouter);

app.use(errorHandler);

export default app;
