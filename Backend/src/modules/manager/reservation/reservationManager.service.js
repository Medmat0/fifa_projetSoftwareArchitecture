import { ReservationService } from '../../reservationService.interface.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { countBusinessDays } from '../../../core/coutBusinessDays.js';


export class ReservationManagerService extends ReservationService {
  async createReservation(userId, slotId, startDate, endDate) {
   

    const businessDays = countBusinessDays(startDate, endDate);
    if (businessDays > 30) {
      return {
        status: 400,
        data: { message: 'La réservation ne peut pas dépasser 30 jours ouvrés (hors week-end).' }
      };
    }
    if (businessDays <= 0) {
      return {
        status: 400,
        data: { message: 'Les dates sélectionnées ne contiennent aucun jour ouvré.' }
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
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        slotId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });
    return {
      status: 200,
      data: { reservation }
    };
  }
}
