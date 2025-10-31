import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById
} from "../controllers/auth.controller.js";

import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";
import { verifyServiceToken } from "../middleware/serviceToken.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);


router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:userId", authMiddleware, adminMiddleware, deleteUser);


router.get("/service/users/:userId", verifyServiceToken, getUserById);

export default router;
