import asyncHandler from "express-async-handler";
import { listOfSlotsStatus } from "./listSlots.service.js";
/**
 * @desc    Get all slots with their availability status
 * @route   GET /employee/reservation/slots
 * @access  Private (employee)
 */
export const listOfSlots = asyncHandler(async (req, res) => {
  const listsOfSlotsWithStatus = await listOfSlotsStatus();
  res.json(listsOfSlotsWithStatus);
});



