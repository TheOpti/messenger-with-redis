import express from "express";

import {
  attemptLogin,
  attemptRegister,
  handleLogin,
  handleLogout,
} from "../controllers/authController";
import { rateLimiter } from "../middleware/rateLimiter";
import {
  validateLoginForm,
  validateRegisterForm,
} from "../middleware/validation";

const router = express.Router();

router
  .route("/login")
  .get(rateLimiter, handleLogin)
  .post(validateLoginForm, rateLimiter, attemptLogin);

router.get("/logout", handleLogout);

router
  .route("/register")
  .post(validateRegisterForm, rateLimiter, attemptRegister);

export default router;
