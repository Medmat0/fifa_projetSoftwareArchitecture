import express from "express";
import { createReservation } from "./reservationEmployee.controller.js";
import { employeeAuth } from "../../../middlewares/auth.middleware.js";
import getAllReservationsRoute from "../queries/getAllReservations/getAllReservations.route.js";
import getCurrentReservationRoute from "../queries/getCurrentReservation/getCurrentReservation.route.js";

const router = express.Router();

// Route to create a reservation
router.post("/create", employeeAuth, createReservation);

// Routes for queries
router.use("/all", getAllReservationsRoute);
router.use("/current", getCurrentReservationRoute);

export default router;
