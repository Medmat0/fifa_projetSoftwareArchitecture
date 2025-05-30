import express from "express";
import { createReservation } from "./reservationManager.controller.js";
import {managerAuth} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",managerAuth, createReservation);

export default router;
