import { describe, it, expect, vi, afterEach } from 'vitest';
import * as queries from './employee.queries.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        user: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('employee.queries.service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllEmployeesService', () => {
        it('retourne la liste des employés', async () => {
            const fakeEmployees = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ];
            prisma.user.findMany.mockResolvedValue(fakeEmployees);

            const result = await queries.getAllEmployeesService();

            expect(prisma.user.findMany).toHaveBeenCalled();
            expect(result).toEqual(fakeEmployees);
        });
    });

    describe('getEmployeeByIdService', () => {
        it('retourne un employé par son id', async () => {
            const req = { params: { id: 1 } };
            const fakeEmployee = { id: 1, name: 'Alice' };
            prisma.user.findUnique.mockResolvedValue(fakeEmployee);

            const result = await queries.getEmployeeByIdService(req);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(fakeEmployee);
        });

        it('retourne null si employé non trouvé', async () => {
            const req = { params: { id: 99 } };
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await queries.getEmployeeByIdService(req);

            expect(result).toBeNull();
        });
    });
});