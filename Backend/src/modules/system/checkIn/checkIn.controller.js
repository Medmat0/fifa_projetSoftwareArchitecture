import asyncHandler from "express-async-handler";
import {checkInReservationService} from "./checkIn.service.js";

export const checkInReservation = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;
  const result = await checkInReservationService(reservationId);
  res.status(result.status).json(result.data);
});