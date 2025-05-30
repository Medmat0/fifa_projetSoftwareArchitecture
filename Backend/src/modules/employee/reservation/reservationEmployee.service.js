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
   * @returns {object} { status, data }
   */
  async createReservation(userId, slotId, startDate, endDate, ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'EMPLOYEE') {
      return {
        status: 403,
        data: { message: 'Only employees can make reservations.' }
      };
    }

   

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


    // Créer la réservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        slotId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        halfDay: false 
        
      }
    });

    return {
      status: 200,
      data: { reservation }
    };
  }
}
