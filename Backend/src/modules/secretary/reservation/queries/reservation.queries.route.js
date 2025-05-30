import { listReservations} from "./listReservation.controller.js";
import express from "express";


const router = express.Router();

router.get("/all", listReservations);


export default router;
