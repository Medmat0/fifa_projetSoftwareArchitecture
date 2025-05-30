import { checkInReservation } from "./checkIn.controller.js";
import express from "express";


const router = express.Router();


router.post("/check-in/:reservationId", checkInReservation);

export default router;