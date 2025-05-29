import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const getAllEmployeesService = async () => {
    return prisma.user.findMany();
}

export const getEmployeeByIdService = async (req) => {
    const { id } = req.params;
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });

}