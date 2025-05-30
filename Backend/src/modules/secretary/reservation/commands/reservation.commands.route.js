import express from "express";
import { deleteReservationController } from "./reservation.commands.controller.js";

const router = express.Router();

router.delete("/:reservationId", deleteReservationController);

export default router;