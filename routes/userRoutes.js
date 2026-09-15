import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

export default router;
