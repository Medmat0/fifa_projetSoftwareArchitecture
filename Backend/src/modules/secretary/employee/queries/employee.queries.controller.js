import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import {getAllEmployees} from "./employee.queries.service.js";

const prisma = new PrismaClient();

/**
 * @desc    Récupère tous les employés
 * @route   GET /secretary/employees
 * @access  Privé
 */
export const getEmployeeQueries = asyncHandler(async (req, res) => {
    const employees = await getAllEmployees(req, res);
    if (employees) {
        res.status(200).json(employees);
    } else {
        res.status(404).json({ message: "Aucun employé trouvé." });
    }
});