import express from "express";
import { getAllReservationsController } from "./getAllReservations.controller.js";
import { employeeAuth } from "../../../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", employeeAuth, getAllReservationsController);

export default router;
