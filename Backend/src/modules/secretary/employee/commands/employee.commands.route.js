import express from "express";
import {
    addEmployeeController,
    deleteEmployeeController,
    updateEmployeeController
} from "./employee.commands.controller.js";


const router = express.Router();

router.post("/",addEmployeeController);
router.patch("/:id",updateEmployeeController);
router.delete("/:id",deleteEmployeeController);

export default router;