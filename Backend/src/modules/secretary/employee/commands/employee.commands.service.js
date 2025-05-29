import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();


export const addEmployeeService = async (employeeData) => {
    const { name, email, password, role, vehicleType } = employeeData;

    if (!name || !email || !password || !role) {
        throw new Error("Tous les champs sont requis.");
    }

    const existingEmployee = await prisma.user.findUnique({
        where: { email }
    });

    if (existingEmployee) {
        throw new Error("Un employé avec cet email existe déjà.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            vehicleType: vehicleType || "UNKNOWN"
        }
    });
}

export const updateEmployeeService = async (id, employeeData) => {
    const existingEmployee = await prisma.user.findUnique({
        where: { id: id }
    });

    if (!existingEmployee) {
        throw new Error("Employé non trouvé.");
    }

    const dataToUpdate = {};
    if (employeeData.name !== undefined) dataToUpdate.name = employeeData.name;
    if (employeeData.email !== undefined) dataToUpdate.email = employeeData.email;
    if (employeeData.role !== undefined) dataToUpdate.role = employeeData.role;
    if (employeeData.vehicleType !== undefined) dataToUpdate.vehicleType = employeeData.vehicleType;

    return prisma.user.update({
        where: { id: id },
        data: dataToUpdate
    });
}

export const deleteEmployeeService = async (id) => {
    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
        where: { id: id }
    });

    if (!existingEmployee) {
        throw new Error("Employé non trouvé.");
    }

    // Delete employee
    return prisma.user.delete({
        where: { id: id }
    });
}