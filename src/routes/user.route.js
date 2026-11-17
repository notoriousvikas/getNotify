import { Router } from "express";
import {
  regsiterUser,
  loginUser,
  signOut,
  getCurrentUserProfile,
  sendOtp,
  verifyUserOtp
} from "../controller/user.controller.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import {loginLimiter,registerLimiter} from "../services/redis/redislimiter.service.js"
import { verifyAuth } from "../middleware/auth.middleware.js";
import { validate, registerUserSchema, loginUserSchema } from "../validators/index.js";

const router = Router();

router.post("/register",rateLimiter(registerLimiter), validate(registerUserSchema), regsiterUser);
router.post("/login",rateLimiter(loginLimiter), validate(loginUserSchema), loginUser);
router.post("/signout", signOut);
router.post("/logout", signOut);
router.get("/me", verifyAuth, getCurrentUserProfile);
router.post("/send-otp",sendOtp);
router.post("/verifyUser",verifyAuth,verifyUserOtp)
export default router;
