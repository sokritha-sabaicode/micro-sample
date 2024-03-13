import express, { Request, Response } from "express";
import {errorHandler} from './middlewares'

const app = express();

// Global Middlewares
app.use(express.json());

// Global API
app.use("/auth", AuthRouter);

app.use(errorHandler);

export default app;
