import express, { Request, Response } from "express";
import {errorHandler} from './middlewares'

const app = express();

// Global Middlewares
app.use(express.json());

// Global API
app.get("/", (req: Request, res: Response) => {
  res.status(200).send({});
});

app.use(errorHandler);

export default app;
