import express from "express";
import { createReservation } from "./reservationEmployee.controller.js";
import {employeeAuth} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// Route to create a reservation
router.post("/create",employeeAuth, createReservation);

export default router;
