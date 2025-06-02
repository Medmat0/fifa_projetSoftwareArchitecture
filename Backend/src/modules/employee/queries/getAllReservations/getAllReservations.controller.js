import asyncHandler from "express-async-handler";
import { getAllReservationsService } from "./getAllReservations.service.js";

/**
 * @desc    Get all reservations for a user with QR codes
 * @route   GET /reservation/all
 * @access  Private (authenticated)
 */
export const getAllReservationsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await getAllReservationsService(userId);
  res.status(result.status).json(result.data);
});
