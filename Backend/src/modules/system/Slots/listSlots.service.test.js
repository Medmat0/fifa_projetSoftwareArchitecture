import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { listOfSlotsStatus } from './listSlots.service.js';

vi.mock('@prisma/client', () => {
  const mPrisma = {
    parkingSlot: { findMany: vi.fn() },
    reservation: { findMany: vi.fn() }
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

describe('listOfSlotsStatus', () => {
  afterEach(() => vi.clearAllMocks());

  it('should return all slots with status and reservations', async () => {
    prisma.parkingSlot.findMany.mockResolvedValue([
      { id: 'A01' }, { id: 'B01' }
    ]);
    prisma.reservation.findMany.mockResolvedValue([
      { slotId: 'A01', startDate: '2025-06-01', endDate: '2025-06-02' },
      { slotId: 'A01', startDate: '2025-06-03', endDate: '2025-06-04' }
    ]);
    const result = await listOfSlotsStatus();
    expect(result).toEqual([
      {
        slotId: 'A01',
        status: 'reserved',
        reservations: [
          { startDate: '2025-06-01', endDate: '2025-06-02' },
          { startDate: '2025-06-03', endDate: '2025-06-04' }
        ]
      },
      {
        slotId: 'B01',
        status: 'dispo',
        reservations: []
      }
    ]);
  });
});