import express from "express";
import { register , login , getProfile , updateProfile} from "../controllers/auth.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js"

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/profile",authMiddleware, getProfile);
router.put("/update",authMiddleware, updateProfile);


export default router