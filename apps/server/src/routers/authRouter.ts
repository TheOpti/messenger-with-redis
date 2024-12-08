import { loginSchema, signupSchema } from "@repo/shared/schema";
import bcryptjs from "bcryptjs";
import express from "express";
import { z } from "zod";

import { prisma } from "../prisma";

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

router.post("/signup", async (req, res) => {
  try {
    const result = signupSchema.parse(req.body);
    const { username, password } = result;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      res.status(200).json({
        message: "Username already exists",
      });

      return;
    }

    const passhash = await bcryptjs.hash(password, 10);
    await prisma.user.create({
      data: { username, passhash },
    });

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
    } else {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
});

export default router;
