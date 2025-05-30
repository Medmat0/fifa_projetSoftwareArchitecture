import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


  /**
   * @desc    Get all slots with their availability status (dispo/réservé) et les dates de réservation en cours
   * @returns {Array<{slotId: string, status: string, startDate?: string, endDate?: string}>}
   */
  async function listOfSlotsStatus() {
    const slots = await prisma.parkingSlot.findMany();
    const now = new Date();
  
    // Récupère les réservations actives à l'instant T
    const reservations = await prisma.reservation.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now }
      }
    });
  
    // Map slotId -> réservation active
    const reservationMap = new Map();
    reservations.forEach(r => {
      reservationMap.set(r.slotId, r);
    });
  
    return slots.map(slot => {
      const reservation = reservationMap.get(slot.id);
      if (reservation) {
        return {
          slotId: slot.id,
          status: "reserved",
          startDate: reservation.startDate,
          endDate: reservation.endDate
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