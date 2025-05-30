import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @desc    Get all slots with their availability status et la liste des réservations actives
 * @returns {Array<{slotId: string, status: string, reservations?: Array<{startDate: string, endDate: string}>}>}
 */
async function listOfSlotsStatus() {
  const slots = await prisma.parkingSlot.findMany();
  const now = new Date();

  // Récupère toutes les réservations à venir ou en cours
  const reservations = await prisma.reservation.findMany({
    where: {
      endDate: { gte: now }
    }
  });

  // Map slotId -> liste de réservations
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
    return {
      slotId: slot.id,
      status: slotReservations.length > 0 ? "reserved" : "dispo",
      reservations: slotReservations
    };
  });
}

export { listOfSlotsStatus };