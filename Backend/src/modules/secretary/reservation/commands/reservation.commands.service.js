import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


/**
 * Supprime une réservation par son id
 * @param {string} reservationId
 * @returns {object} { status, data }
 * 
 */

export class ReservationEmployeeService extends ReservationService {

  async deleteReservation(reservationId) {
    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
    if (!reservation) {
      return { status: 404, data: { message: "Reservation not found" } };
    }
    await prisma.reservation.delete({ where: { id: reservationId } });
    return { status: 200, data: { message: "Reservation deleted successfully" } };
  }

}