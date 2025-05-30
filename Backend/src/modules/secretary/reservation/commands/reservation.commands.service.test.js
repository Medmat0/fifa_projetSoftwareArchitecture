import { describe, it, expect, vi, afterEach } from 'vitest';
import { ReservationEmployeeService } from './reservation.commands.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        reservation: {
            findUnique: vi.fn(),
            delete: vi.fn(),
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('ReservationEmployeeService', () => {
    const service = new ReservationEmployeeService();

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('deleteReservation', () => {
        it('supprime une réservation existante', async () => {
            prisma.reservation.findUnique.mockResolvedValue({ id: 'abc' });
            prisma.reservation.delete.mockResolvedValue({ id: 'abc' });

            const result = await service.deleteReservation('abc');

            expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: 'abc' } });
            expect(prisma.reservation.delete).toHaveBeenCalledWith({ where: { id: 'abc' } });
            expect(result).toEqual({ status: 200, data: { message: 'Reservation deleted successfully' } });
        });

        it('retourne 404 si la réservation est introuvable', async () => {
            prisma.reservation.findUnique.mockResolvedValue(null);

            const result = await service.deleteReservation('notfound');

            expect(prisma.reservation.findUnique).toHaveBeenCalledWith({ where: { id: 'notfound' } });
            expect(prisma.reservation.delete).not.toHaveBeenCalled();
            expect(result).toEqual({ status: 404, data: { message: 'Reservation not found' } });
        });
    });
});