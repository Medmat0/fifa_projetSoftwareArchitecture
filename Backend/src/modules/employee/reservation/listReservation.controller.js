import asyncHandler from "express-async-handler";
import { listOfSlotsStatus, listAllReservations } from "./listReservation.service.js";
/**
 * @desc    Get all slots with their availability status
 * @route   GET /employee/reservation/slots
 * @access  Private (employee)
 */
export const listOfSlots = asyncHandler(async (req, res) => {
  const listsOfSlotsWithStatus = await listOfSlotsStatus();
  res.json(listsOfSlotsWithStatus);
});


export const listReservations = asyncHandler(async (req, res) => {
  const reservations = await listAllReservations();
  res.json(reservations);
});
