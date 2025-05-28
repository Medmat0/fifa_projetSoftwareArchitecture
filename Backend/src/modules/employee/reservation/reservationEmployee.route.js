import express from "express";
import { createReservation } from "./reservationEmployee.controller.js";

const router = express.Router();

// Route to create a reservation
router.post("/create", createReservation);

export default router;
