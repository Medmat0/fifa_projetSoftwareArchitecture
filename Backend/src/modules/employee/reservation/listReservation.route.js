import {listOfSlots, listReservations} from "./listReservation.controller.js";
import express from "express";


const router = express.Router();

router.get("/all", listReservations);


router.get("/slots", listOfSlots);
export default router;
