import { loginSchema, signupSchema } from "@repo/shared/schema";
import bcryptjs from "bcryptjs";
import express from "express";
import { z } from "zod";

import { prisma } from "../prisma";

const router = express.Router();

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user?.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
      return;
    }

    res.json({ loggedIn: false });
  })
  .post(async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        res.status(404).json({
          loggedIn: false,
          message: "Wrong username or password.",
        });

        return;
      }

      const isSamePassword = await bcryptjs.compare(password, user.passhash);

      if (isSamePassword) {
        req.session.user = {
          username: req.body.username,
          id: user.id,
        };

        res.status(200).json({
          loggedIn: true,
          username: req.body.username,
        });

        return;
      }

      res.status(404).json({
        loggedIn: false,
        message: "Wrong username or password.",
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

router.post("/register", async (req, res) => {
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
    const createResult = await prisma.user.create({
      data: { username, passhash },
    });

    req.session.user = {
      username: req.body.username,
      id: createResult.id,
    };

    res.status(200).json({
      loggedIn: true,
      username: req.body.username,
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
