import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @desc    Get all slots with their availability status et la liste des réservations actives
 * @returns {Array<{slotId: string, status: string, reservations?: Array<{startDate: string, endDate: string}>}>}
 */
async function listOfSlotsStatus() {
  const slots = await prisma.parkingSlot.findMany();
  const now = new Date();

  const reservations = await prisma.reservation.findMany({
    where: {
      startDate: { lte: now },
      endDate: { gte: now }
    }
  });

  const reservationMap = new Map();
  reservations.forEach(r => {
    if (!reservationMap.has(r.slotId)) {
      reservationMap.set(r.slotId, []);
    }
    reservationMap.get(r.slotId).push({
      startDate: r.startDate,
      endDate: r.endDate
    });
  });

  return slots.map(slot => {
    const slotReservations = reservationMap.get(slot.id) || [];
    if (slotReservations.length > 0) {
      return {
        slotId: slot.id,
        status: "reserved",
        reservations: slotReservations
      };
    } else {
      return {
        slotId: slot.id,
        status: "dispo"
      };
    }
  });
}

export { listOfSlotsStatus };