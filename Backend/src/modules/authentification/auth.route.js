import express from "express";
import {login, checkAuthStatus, logout} from "./auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.get("/auth-check", checkAuthStatus);
router.post("/logout",logout);

export default router;
