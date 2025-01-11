import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "../prisma";

export const handleLogin = async (req: Request, res: Response) => {
  if (req.session.user?.username) {
    res.json({
      loggedIn: true,
      username: req.session.user?.username,
      userid: req.session.user?.userid,
    });
    return;
  }

  res.json({
    loggedIn: false,
    username: "",
    userid: "",
  });
};

export const handleLogout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error destroying session");
    }

    res.clearCookie("sid");
    res.send("Logged out!");
  });
};

export const attemptLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

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
        userid: user.userid,
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
    res.status(400).json({
      loggedIn: false,
      message: "Something went wrong",
    });
  }
};

export const attemptRegister = async (req: Request, res: Response) => {
  try {
    const result = req.body;
    const { username, password } = result;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      res.status(400).json({
        field: "username",
        message: "Username already exists",
      });

      return;
    }

    const passhash = await bcryptjs.hash(password, 10);
    const createResult = await prisma.user.create({
      data: { username, passhash, userid: uuidv4() },
    });

    req.session.user = {
      username: req.body.username,
      id: createResult.id,
      userid: createResult.userid,
    };

    res.status(200).json({
      loggedIn: true,
      username: req.body.username,
      userid: createResult.userid,
    });
  } catch (err) {
    res.status(400).json({
      loggedIn: false,
      message: "Something went wrong",
    });
  }
};
