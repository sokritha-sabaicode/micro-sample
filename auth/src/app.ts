import express, { Request, Response } from "express";
import {errorHandler} from './middleware'

const app = express();

// Global Middlewares
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({});
});

app.use(errorHandler);

export default app;
