import asyncHandler from "express-async-handler";
import { ReservationEmployeeService } from "./reservationEmployee.service.js";

const reservationService = new ReservationEmployeeService();

/**
 * @desc    Create a reservation with validation + QR code
 * @route   POST /reservation/create
 * @access  Private (user must be authenticated)
 */
export const createReservation = asyncHandler(async (req, res) => {
  const { slotId, startDate, endDate } = req.body;
  const userId = req.user.id;

  const result = await reservationService.createReservation(userId, slotId, startDate, endDate);
  res.status(result.status).json(result.data);
});
