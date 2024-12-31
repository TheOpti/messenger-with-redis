import express from "express";

import {
  attemptLogin,
  attemptRegister,
  handleLogin,
  handleLogout,
} from "../controllers/authController";
import {
  validateLoginForm,
  validateRegisterForm,
} from "../middleware/validation";

const router = express.Router();

router.route("/login").get(handleLogin).post(validateLoginForm, attemptLogin);
router.get("/logout", handleLogout);

router.route("/register").post(validateRegisterForm, attemptRegister);

export default router;
