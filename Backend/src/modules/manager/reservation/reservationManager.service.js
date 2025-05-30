import { ReservationService } from '../../../reservationService.interface.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class ReservationManagerService extends ReservationService {
  async createReservation(userId, slotId, startDate, endDate) {
    // Exemple de logique spécifique manager (à adapter selon besoins)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'MANAGER') {
      return {
        status: 403,
        data: { message: 'Only managers can make reservations here.' }
      };
    }
    // Ici, on peut mettre des règles différentes pour les managers
    // Par exemple, pas de limite de jours, ou priorité sur certains slots
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
