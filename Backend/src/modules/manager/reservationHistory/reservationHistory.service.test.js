import { describe, it, expect, vi, afterEach } from 'vitest';
import { getReservationStats } from './reservationHistory.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        reservation: {
            findMany: vi.fn(),
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('getReservationStats', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('calcule les stats par jour, semaine et mois', async () => {
        prisma.reservation.findMany.mockResolvedValue([
            { id: '1', startDate: '2024-06-01T10:00:00Z' },
            { id: '2', startDate: '2024-06-01T12:00:00Z' },
            { id: '3', startDate: '2024-06-02T09:00:00Z' },
            { id: '4', startDate: '2024-06-15T09:00:00Z' },
            { id: '5', startDate: '2024-07-01T09:00:00Z' }
        ]);

        const stats = await getReservationStats();

        expect(stats.byDay).toEqual({
            '2024-06-01': 2,
            '2024-06-02': 1,
            '2024-06-15': 1,
            '2024-07-01': 1
        });
        expect(Object.keys(stats.byWeek).length).toBeGreaterThan(0);
        expect(stats.byMonth).toEqual({
            '2024-06': 4,
            '2024-07': 1
        });
    });

    it('retourne des objets vides si aucune réservation', async () => {
        prisma.reservation.findMany.mockResolvedValue([]);

        const stats = await getReservationStats();

        expect(stats.byDay).toEqual({});
        expect(stats.byWeek).toEqual({});
        expect(stats.byMonth).toEqual({});
    });
});