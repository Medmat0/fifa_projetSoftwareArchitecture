import { listReservations} from "./reservation.queries.controller.js";
import express from "express";


const router = express.Router();

router.get("/", listReservations);


export default router;
