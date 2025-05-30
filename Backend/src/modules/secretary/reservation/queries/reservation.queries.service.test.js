import { describe, it, expect, vi, afterEach } from 'vitest';
import { listAllReservations } from './reservation.queries.service.js';

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

describe('reservation.queries.service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('listAllReservations', () => {
        it('retourne la liste des réservations', async () => {
            const fakeReservations = [
                {
                    id: '1',
                    slot: { id: 'slot1' },
                    user: { id: 1, name: 'Alice', email: 'alice@mail.com', role: 'EMPLOYEE' }
                }
            ];
            prisma.reservation.findMany.mockResolvedValue(fakeReservations);

            const result = await listAllReservations();

            expect(prisma.reservation.findMany).toHaveBeenCalledWith({
                include: {
                    slot: true,
                    user: { select: { id: true, name: true, email: true, role: true } }
                }
            });
            expect(result).toEqual(fakeReservations);
        });

        it('retourne un tableau vide si aucune réservation', async () => {
            prisma.reservation.findMany.mockResolvedValue([]);

            const result = await listAllReservations();

            expect(result).toEqual([]);
        });
    });
});