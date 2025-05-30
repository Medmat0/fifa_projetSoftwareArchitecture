import {listOfSlots} from "./listSlots.controller.js";
import express from "express";


const router = express.Router();

router.get("/all", listOfSlots);


export default router;
