
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


  /**
   * @desc    Get all slots with their availability status (dispo/réservé)
   * @returns {Array<{slotId: string, status: string}>}
   */
  async function listOfSlotsStatus() {
      const slots = await prisma.parkingSlot.findMany();
      const now = new Date();
      console.log("Current time:", now);
      const reservations = await prisma.reservation.findMany({
        where: {
          startDate: { lte: now },
          endDate: { gte: now }
        }
      });
      console.log("Current reservations:", reservations);
  
      const reservedSlotIds = new Set(reservations.map(r => r.slotId));
  
      return slots.map(slot => ({
        slotId: slot.id,
        status: reservedSlotIds.has(slot.id) ? "réservé" : "dispo"
      }));
  }
 async function listAllReservations() {
  return await prisma.reservation.findMany({
    include: {
      slot: true,
      user: { select: { id: true, name: true, email: true, role: true } }
    }
  });
}

export { listOfSlotsStatus, listAllReservations };