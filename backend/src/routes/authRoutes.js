import express from "express";
import { register,login,refresh,logout,profile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { loginLimiter,registerLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register",registerLimiter,register);
router.post("/login",loginLimiter,login);
router.post("/refresh",refresh);
router.post("/logout",logout);
router.get("/profile",authMiddleware,profile);

export default router ;