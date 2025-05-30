import { describe, it, expect, vi, afterEach } from 'vitest';
import { addEmployeeService, updateEmployeeService, deleteEmployeeService } from './employee.commands.service.js';
import bcrypt from 'bcrypt';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn()
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});
vi.mock('bcrypt');

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('employee.commands.service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('addEmployeeService', () => {
        it('crée un employé avec succès', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed');
            prisma.user.create.mockResolvedValue({ id: 1, name: 'Test' });

            const result = await addEmployeeService({
                name: 'Test',
                email: 'test@mail.com',
                password: 'pass',
                role: 'SECRETARY',
            });

            expect(prisma.user.create).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, name: 'Test' });
        });

        it('échoue si un champ est manquant', async () => {
            await expect(addEmployeeService({
                name: '',
                email: '',
                password: '',
                role: ''
            })).rejects.toThrow('Tous les champs sont requis.');
        });

        it('échoue si email déjà utilisé', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1 });
            await expect(addEmployeeService({
                name: 'Test',
                email: 'test@mail.com',
                password: 'pass',
                role: 'SECRETARY',
            })).rejects.toThrow('Un employé avec cet email existe déjà.');
        });
    });

    describe('updateEmployeeService', () => {
        it('met à jour un employé existant', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1 });
            prisma.user.update.mockResolvedValue({ id: 1, name: 'NouveauNom' });

            const result = await updateEmployeeService(1, { name: 'NouveauNom' });

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'NouveauNom' }
            });
            expect(result).toEqual({ id: 1, name: 'NouveauNom' });
        });

        it('échoue si employé non trouvé', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(updateEmployeeService(1, { name: 'Test' }))
                .rejects.toThrow('Employé non trouvé.');
        });
    });

    describe('deleteEmployeeService', () => {
        it('supprime un employé existant', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1 });
            prisma.user.delete.mockResolvedValue({ id: 1 });

            const result = await deleteEmployeeService(1);

            expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1 });
        });

        it('échoue si employé non trouvé', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(deleteEmployeeService(1))
                .rejects.toThrow('Employé non trouvé.');
        });
    });
});