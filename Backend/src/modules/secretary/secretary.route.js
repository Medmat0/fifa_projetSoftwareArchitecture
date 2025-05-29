import express from "express";
import employeeRoute from "./employee/employee.route.js";
import {roleMiddleWare} from "../../middlewares/role.middleware.js";


const router = express.Router();
router.use(roleMiddleWare("SECRETARY"));
router.use("/employees",employeeRoute)
//router.use("/reservations");

export default router;