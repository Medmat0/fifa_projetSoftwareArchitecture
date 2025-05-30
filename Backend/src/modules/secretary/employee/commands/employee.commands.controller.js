import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";
import {addEmployeeService, deleteEmployeeService, updateEmployeeService} from "./employee.commands.service.js";

const prisma = new PrismaClient();





export const addEmployeeController = asyncHandler(async (req, res) => {
    try {
        const newEmployee = await addEmployeeService(req.body);
        res.status(201).json(newEmployee);
    }catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }


});

/**
 * * @desc    Update an employee
 * @method  PUT
 * @route   /employees/:id
 */

export const updateEmployeeController = asyncHandler(async (req, res) => {
    try {
        const updatedEmployee = await updateEmployeeService(req.params.id, req.body);
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employé non trouvé." });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});


export const deleteEmployeeController = asyncHandler(async (req, res) => {
    try {
        const deletedEmployee = await deleteEmployeeService(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employé non trouvé." });
        }
        res.status(200).json({ message: "Employé supprimé avec succès." });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});