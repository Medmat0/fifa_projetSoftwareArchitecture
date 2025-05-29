import express from "express";
import employeeRoute from "./employee/employee.route.js";


const router = express.Router();

router.use("/employees",employeeRoute)
//router.use("/reservations");

export default router;