import express from "express";
import { reservationStatsController } from "./reservationHistory.controller.js";
import { managerAuth } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", managerAuth, reservationStatsController);

export default router;