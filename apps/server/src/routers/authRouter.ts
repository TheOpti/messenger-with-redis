import express from "express";
import { z } from "zod";

const router = express.Router();

const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be 20 characters or less" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password must be 20 characters or less" }),
});

router.post("/login", (req, res) => {
  try {
    const result = loginSchema.parse(req.body);

    res.status(200).json({
      message: "Login successful",
      username: result.username,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: err.errors.map((validationError) => ({
          field: validationError.path[0],
          message: validationError.message,
        })),
      });
    }
  }
});

router.post("/signup", (req, res) => {
  try {
    const result = loginSchema.parse(req.body);

    res.status(200).json({
      message: "Account created successfully",
      username: result.username,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: err.errors.map((validationError) => ({
          field: validationError.path[0],
          message: validationError.message,
        })),
      });
    }
  }
});

export default router;
