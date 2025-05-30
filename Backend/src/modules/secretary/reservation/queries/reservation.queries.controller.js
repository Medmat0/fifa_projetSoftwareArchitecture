import asyncHandler from "express-async-handler";
import {  listAllReservations } from "./listReservation.service.js";



export const listReservations = asyncHandler(async (req, res) => {
  const reservations = await listAllReservations();
  res.json(reservations);
});
