import { ReservationService } from '../../reservationService.interface.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ReservationEmployeeService extends ReservationService {
  /**
   * @desc    Create a new parking reservation
   * @param   {string} userId
   * @param   {string} slotId
   * @param   {Date} startDate
   * @param   {Date} endDate
   * @param   {boolean} halfDay
   * @returns {object} { status, data }
   */
  async createReservation(userId, slotId, startDate, endDate, halfDay) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'EMPLOYEE') {
      return {
        status: 403,
        data: { message: 'Only employees can make reservations.' }
      };
    }

    // Vérifier la durée de réservation (max 5 jours pour les employés)
    const diffDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (diffDays > 5) {
      return {
        status: 400,
        data: { message: 'Employees can only reserve for up to 5 working days.' }
      };
    }

    // Vérifier si la place est disponible
    const existingReservations = await prisma.reservation.findMany({
      where: {
        slotId,
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    if (existingReservations.length > 0) {
      return {
        status: 400,
        data: { message: 'The selected slot is not available for the chosen dates.' }
      };
    }

    // Vérifier les places électriques
    const slot = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
    if (slot.isElectric && !['ELECTRIC', 'HYBRID'].includes(user.vehicleType)) {
      return {
        status: 400,
        data: { message: 'You can only reserve electric slots with an electric or hybrid vehicle.' }
      };
    }

    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        slotId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        halfDay
      }
    });

    return {
      status: 200,
      data: { reservation }
    };
  }
}
