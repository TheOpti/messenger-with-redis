import { loginSchema, signupSchema } from "@repo/shared/schema";
import express from "express";
import { z } from "zod";

const router = express.Router();

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
    const result = signupSchema.parse(req.body);

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
