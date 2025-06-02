import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ReservationEmployeeService } from './reservationEmployee.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        user: { findUnique: vi.fn() },
        reservation: { findMany: vi.fn(), create: vi.fn() }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});
vi.mock('../../../core/coutBusinessDays.js', () => ({
    countBusinessDays: vi.fn()
}));
vi.mock('../../../core/generateQR.js', () => ({
    generateQRCode: vi.fn()
}));

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const { countBusinessDays } = await import('../../../core/coutBusinessDays.js');
const { generateQRCode } = await import('../../../core/generateQR.js');

describe('ReservationEmployeeService', () => {
    let service;
    beforeEach(() => {
        service = new ReservationEmployeeService();
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('refuse si utilisateur non employé', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '1', role: 'MANAGER' });
        const result = await service.createReservation('1', 'slot1', '2024-06-01', '2024-06-02');
        expect(result.status).toBe(403);
    });

    it('refuse si total jours ouvrés > 5', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '1', role: 'EMPLOYEE' });
        prisma.reservation.findMany.mockResolvedValueOnce([
            { startDate: '2024-05-01', endDate: '2024-05-03' }
        ]);
        countBusinessDays.mockReturnValueOnce(3).mockReturnValueOnce(3);
        const result = await service.createReservation('1', 'slot1', '2024-06-01', '2024-06-03');
        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/dépasser 5 jours/);
    });

    it('refuse si chevauchement de réservation utilisateur', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '1', role: 'EMPLOYEE' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([{ id: 'r1' }]); // overlappingReservations
        countBusinessDays.mockReturnValue(2);
        const result = await service.createReservation('1', 'slot1', '2024-06-01', '2024-06-02');
        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/déjà une réservation/);
    });

    it('refuse si slot déjà réservé', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '1', role: 'EMPLOYEE' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([]) // overlappingReservations
            .mockResolvedValueOnce([{ id: 'r2' }]); // existingReservations
        countBusinessDays.mockReturnValue(2);
        const result = await service.createReservation('1', 'slot1', '2024-06-01', '2024-06-02');
        expect(result.status).toBe(400);
        expect(result.data.message).toMatch(/n'est pas disponible/);
    });

    it('crée la réservation et retourne le QR code', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: '1', role: 'EMPLOYEE' });
        prisma.reservation.findMany
            .mockResolvedValueOnce([]) // userReservations
            .mockResolvedValueOnce([]) // overlappingReservations
            .mockResolvedValueOnce([]); // existingReservations
        countBusinessDays.mockReturnValue(2);
        prisma.reservation.create.mockResolvedValue({ id: 'res1' });
        generateQRCode.mockResolvedValue('qrcode');
        const result = await service.createReservation('1', 'slot1', '2024-06-01', '2024-06-02');
        expect(result.status).toBe(200);
        expect(result.data.reservation).toMatchObject({ id: 'res1' });
        expect(result.data.qrCode).toBe('qrcode');
    });
});