import express from "express";
import {getAllEmployeesController, getEmployeeByIdController} from "./employee.queries.controller.js";

const router = express.Router();

router.get("/",getAllEmployeesController);
router.get("/:id",getEmployeeByIdController);

export default router;