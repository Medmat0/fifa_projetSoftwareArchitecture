import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import {getAllEmployeesService, getEmployeeByIdService} from "./employee.queries.service.js";

const prisma = new PrismaClient();

/**
 * @desc    Récupère tous les employés
 * @route   GET /secretary/employees
 * @access  Privé
 */
export const getAllEmployeesController = asyncHandler(async (req, res) => {
    try {
        const employees = await getAllEmployeesService();
        res.status(200).json(employees);

    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(400).json({ message: error.message || "Erreur interne du serveur." });
    }


});

/**
 * @desc    Récupère un employé par son ID
 * @route   GET /secretary/employees/:id
 * @access  Privé
 */

export const getEmployeeByIdController = asyncHandler(async (req, res) => {
    try {
        const employee = await getEmployeeByIdService(req);
        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé." });
        }
        res.status(200).json(employee);

    }catch (error) {
        console.error("Error fetching employee by ID:", error);
        res.status(400).json({ message: error.message || "Erreur interne du serveur." });
    }
});