import express from 'express';
import reservationCommandRoute from "./commands/reservation.commands.route.js";
import reservationQueries from "./queries/reservation.queries.route.js";
const router = express.Router();

router.use("/delete",reservationCommandRoute);
router.use("/",reservationQueries)

export default router;
