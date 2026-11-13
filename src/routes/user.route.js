import { Router } from "express";
import {
  regsiterUser,
  loginUser,
  signOut,
  getCurrentUserProfile,
  sendOtp,
  verifyUserOtp
} from "../controller/user.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";
import { validate, registerUserSchema, loginUserSchema } from "../validators/index.js";

const router = Router();

router.post("/register", validate(registerUserSchema), regsiterUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post("/signout", signOut);
router.post("/logout", signOut);
router.get("/me", verifyAuth, getCurrentUserProfile);
router.post("/send-otp",sendOtp);
router.post("/verifyUser",verifyAuth,verifyUserOtp)
export default router;
