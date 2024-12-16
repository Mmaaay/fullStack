import express from "express";
import {
  loginUser,
  registerUser,
  validateToken,
} from "../controllers/userController.js";

const router = express.Router();

// Route for registering a user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/validate", validateToken);
export default router;
