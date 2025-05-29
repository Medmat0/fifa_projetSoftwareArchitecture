import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const getAllEmployees = async(req, res) => {
    try {
        const employees = await prisma.user.findMany();
        return res.status(200).json(employees);
    }catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}