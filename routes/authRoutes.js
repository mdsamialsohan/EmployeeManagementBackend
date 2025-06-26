import express from "express";
import { login, logout, signup } from "../controllers/auth.js";
import verifyUser from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", verifyUser, logout);
export default router;
