import express from "express";
import {login, checkAuthStatus, logout, checkRole} from "./auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/auth-check", checkAuthStatus);
router.post("/logout",logout);
router.get("/check-role", checkRole);

export default router;
