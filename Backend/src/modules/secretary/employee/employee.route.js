import express from 'express';
import employeeCommandsRoute from "./commands/employee.commands.route.js";
import employeeQueriesRoute from "./queries/employee.queries.route.js";
const router = express.Router();

router.use("/",employeeCommandsRoute);
router.use("/",employeeQueriesRoute)

export default router;
