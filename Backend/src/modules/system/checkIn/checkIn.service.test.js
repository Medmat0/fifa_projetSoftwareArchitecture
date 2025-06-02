import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkInReservationService } from './checkIn.service.js';

vi.mock('@prisma/client', () => {
  const mPrisma = {
    reservation: {
      findUnique: vi.fn(),
      update: vi.fn()
    }
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('checkInReservationService', () => {
  afterEach(() => vi.clearAllMocks());

  it('should return 404 if reservation not found', async () => {
    prisma.reservation.findUnique.mockResolvedValue(null);
    const result = await checkInReservationService('id');
    expect(result.status).toBe(404);
  });

  it('should return 400 if not the reservation day', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    prisma.reservation.findUnique.mockResolvedValue({ startDate: yesterday });
    const result = await checkInReservationService('id');
    expect(result.status).toBe(400);
  });

  it('should return 400 if after 11am', async () => {
    const now = new Date();
    now.setHours(12);
    const startDate = new Date(now);
    prisma.reservation.findUnique.mockResolvedValue({ startDate });
    global.Date = class extends Date {
      constructor() { super(); return now; }
    };
    const result = await checkInReservationService('id');
    expect(result.status).toBe(400);
  });

  it('should update reservation and return 200 if check-in is valid', async () => {
    const now = new Date();
    now.setHours(9);
    const startDate = new Date(now);
    prisma.reservation.findUnique.mockResolvedValue({ startDate });
    prisma.reservation.update.mockResolvedValue({});
    global.Date = class extends Date {
      constructor() { super(); return now; }
    };
    const result = await checkInReservationService('id');
    expect(result.status).toBe(200);
  });
});