import asyncHandler from "express-async-handler";
import { ReservationEmployeeService } from "./reservation.commands.service.js";

/**
 * Controller pour supprimer une réservation
 */

const reservationService = new ReservationEmployeeService();


export const deleteReservationController = asyncHandler(async (req, res) => {
  const { reservationId } = req.params;
  const result = await reservationService.deleteReservation(reservationId);
  res.status(result.status).json(result.data);
});