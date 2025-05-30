
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


  /**
   * @desc    Get all slots with their availability status (dispo/réservé)
   * @returns {Array<{slotId: string, status: string}>}
   */
 async function listAllReservations() {
  return await prisma.reservation.findMany({
    include: {
      slot: true,
      user: { select: { id: true, name: true, email: true, role: true } }
    }
  });
}

export {  listAllReservations };