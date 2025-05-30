import asyncHandler from "express-async-handler";
import { getReservationStats } from "./reservationHistory.service.js";

/**
 * Controller pour stats de réservation
 */
export const reservationStatsController = asyncHandler(async (req, res) => {
  const stats = await getReservationStats();
  res.json(stats);
});