import express from "express";
import employeeRoute from "./employee/employee.route.js";
import {secretaryAuth} from "../../middlewares/auth.middleware.js";


const router = express.Router();
router.use(secretaryAuth);
router.use("/employees",employeeRoute)
//router.use("/reservations");

export default router;