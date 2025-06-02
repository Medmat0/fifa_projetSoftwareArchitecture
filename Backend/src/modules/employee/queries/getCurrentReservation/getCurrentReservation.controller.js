import asyncHandler from "express-async-handler";
import { getCurrentReservationService } from "./getCurrentReservation.service.js";

/**
 * @desc    Get current day reservation for a user with QR code
 * @route   GET /reservation/current
 * @access  Private (authenticated)
 */
export const getCurrentReservationController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await getCurrentReservationService(userId);
  res.status(result.status).json(result.data);
});
