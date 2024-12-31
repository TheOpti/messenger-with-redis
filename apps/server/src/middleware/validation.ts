import { loginSchema, signupSchema } from "@repo/shared/schema";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateLoginForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      returnResWithError(err, res);
    }
  }
};

export const validateRegisterForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      returnResWithError(err, res);
    }
  }
};

const returnResWithError = (err: z.ZodError, res: Response) => {
  res.status(400).json({
    message: "Validation error",
    errors: err.errors.map((validationError) => ({
      field: validationError.path[0],
      message: validationError.message,
    })),
  });
};
