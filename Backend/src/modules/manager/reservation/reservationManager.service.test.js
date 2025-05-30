import { describe, it, expect, vi, afterEach } from 'vitest';
import { ReservationManagerService } from './reservationManager.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        user: { findUnique: vi.fn() },
        reservation: {
            findMany: vi.fn(),
            create: vi.fn()
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});
vi.mock('../../../core/coutBusinessDays.js', () => ({
    countBusinessDays: vi.fn()
}));

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const { countBusinessDays } = await import('../../../core/coutBusinessDays.js');

describe('ReservationManagerService', () => {
    const service = new ReservationManagerService();

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('crée une réservation avec succès', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'MANAGER' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([]) // overlappingReservations
            .mockResolvedValueOnce([]); // existingReservations
        countBusinessDays.mockReturnValueOnce(0).mockReturnValueOnce(5); // totalWorkingDays, newReservationDays
        const fakeReservation = { id: 'r1', userId: 1, slotId: 's1' };
        prisma.reservation.create.mockResolvedValue(fakeReservation);

        const result = await service.createReservation(1, 's1', '2024-06-01', '2024-06-05');

        expect(result.status).toBe(200);
        expect(result.data.reservation).toEqual(fakeReservation);
    });

    it('refuse si utilisateur non manager', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 2, role: 'EMPLOYEE' });

        const result = await service.createReservation(2, 's1', '2024-06-01', '2024-06-05');

        expect(result.status).toBe(403);
        expect(result.data.message).toMatch(/Only managers/);
    });

    it('refuse si dépassement de 30 jours ouvrables', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'MANAGER' });
        prisma.reservation.findMany.mockResolvedValueOnce([{ startDate: '2024-05-01', endDate: '2024-05-10' }]);
        countBusinessDays.mockReturnValueOnce(28).mockReturnValueOnce(5);

        const result = await service.createReservation(1, 's1', '2024-06-01', '2024-06-05');

        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/ne peut pas dépasser 30 jours/);
    });

    it('refuse si réservation chevauche une existante pour l\'utilisateur', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'MANAGER' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([{ id: 'r2' }]); // overlappingReservations
        countBusinessDays.mockReturnValueOnce(0).mockReturnValueOnce(5);

        const result = await service.createReservation(1, 's1', '2024-06-01', '2024-06-05');

        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/déjà une réservation/);
    });

    it('refuse si slot déjà réservé sur la période', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'MANAGER' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([]) // overlappingReservations
            .mockResolvedValueOnce([{ id: 'r3' }]); // existingReservations
        countBusinessDays.mockReturnValueOnce(0).mockReturnValueOnce(5);

        const result = await service.createReservation(1, 's1', '2024-06-01', '2024-06-05');

        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/n'est pas disponible/);
    });
});