// src/middlewares/validateMiddleware.ts
import InvalidInputError from "@auth/errors/invalid-input-error";
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";


const validateInput = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return next(new InvalidInputError(error));
      }
      next(error);
    }
  };
};

export default validateInput;
