import { describe, it, expect, vi, afterEach } from 'vitest';
import * as currentService from './getCurrentReservation.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        reservation: {
            findFirst: vi.fn(),
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

describe('getCurrentReservationService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('retourne la réservation du jour avec QR code', async () => {
        const fakeReservation = { id: 1, userId: 2, startDate: new Date(), endDate: new Date() };
        prisma.reservation.findFirst.mockResolvedValue(fakeReservation);
        generateQRCode.mockResolvedValue('qr-1');

        const result = await currentService.getCurrentReservationService(2);

        expect(result.status).toBe(200);
        expect(result.data.reservation).toEqual(fakeReservation);
        expect(result.data.qrCode).toBe('qr-1');
        expect(prisma.reservation.findFirst).toHaveBeenCalled();
        expect(generateQRCode).toHaveBeenCalledWith(1);
    });

    it('retourne 404 si aucune réservation trouvée', async () => {
        prisma.reservation.findFirst.mockResolvedValue(null);

        const result = await currentService.getCurrentReservationService(2);

        expect(result.status).toBe(404);
        expect(result.data).toHaveProperty('message');
    });

    it('retourne 500 en cas d\'erreur', async () => {
        prisma.reservation.findFirst.mockRejectedValue(new Error('fail'));

        const result = await currentService.getCurrentReservationService(2);

        expect(result.status).toBe(500);
        expect(result.data).toHaveProperty('message');
    });
});