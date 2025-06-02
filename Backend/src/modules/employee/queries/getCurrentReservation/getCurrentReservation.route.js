import express from "express";
import { getCurrentReservationController } from "./getCurrentReservation.controller.js";
import { employeeAuth } from "../../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", employeeAuth, getCurrentReservationController);

export default router;
