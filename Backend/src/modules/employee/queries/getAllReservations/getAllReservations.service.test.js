import { describe, it, expect, vi, afterEach } from 'vitest';
import * as reservationService from './getAllReservations.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        reservation: {
            findMany: vi.fn(),
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});
vi.mock('../../../../core/generateQR.js', () => ({
    generateQRCode: vi.fn()
}));

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const { generateQRCode } = await import('../../../../core/generateQR.js');

describe('getAllReservationsService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('retourne les réservations avec QR code', async () => {
        const reservations = [
            { id: 1, userId: 2, endDate: new Date(Date.now() + 10000), startDate: new Date() },
            { id: 2, userId: 2, endDate: new Date(Date.now() + 20000), startDate: new Date() }
        ];
        prisma.reservation.findMany.mockResolvedValue(reservations);
        generateQRCode.mockImplementation(async (id) => `qr-${id}`);

        const result = await reservationService.getAllReservationsService(2);

        expect(result.status).toBe(200);
        expect(result.data).toHaveLength(2);
        expect(result.data[0]).toHaveProperty('reservation');
        expect(result.data[0]).toHaveProperty('qrCode', 'qr-1');
        expect(result.data[1]).toHaveProperty('qrCode', 'qr-2');
        expect(prisma.reservation.findMany).toHaveBeenCalledWith({
            where: {
                userId: 2,
                endDate: { gte: expect.any(Date) }
            },
            orderBy: { startDate: 'asc' }
        });
    });

    it('retourne une erreur en cas d\'exception', async () => {
        prisma.reservation.findMany.mockRejectedValue(new Error('fail'));
        const result = await reservationService.getAllReservationsService(2);
        expect(result.status).toBe(500);
        expect(result.data).toHaveProperty('message');
    });
});