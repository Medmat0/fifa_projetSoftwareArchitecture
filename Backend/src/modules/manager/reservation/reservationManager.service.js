import { ReservationService } from '../../reservationService.interface.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { countBusinessDays } from '../../../core/coutBusinessDays.js';


export class ReservationManagerService extends ReservationService {
  async createReservation(userId, slotId, startDate, endDate) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'MANAGER') {
      return {
        status: 403,
        data: { message: 'Only managers can make reservations here.' }
      };
    }

    const userReservations = await prisma.reservation.findMany({
      where: {
        userId,
        endDate: {
          gte: new Date() 
        }
      }
    });

    let totalWorkingDays = 0;
    for (const reservation of userReservations) {
      const reservationStart = new Date(reservation.startDate);
      const reservationEnd = new Date(reservation.endDate);
      totalWorkingDays += countBusinessDays(reservationStart, reservationEnd);
    }

    const newReservationDays = countBusinessDays(startDate, endDate);

    if (totalWorkingDays + newReservationDays > 30) {
      return {
        status: 400,
        data: { message: 'Le total de vos réservations ne peut pas dépasser 30 jours ouvrables.' }
      };
    }

    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        userId,
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    if (overlappingReservations.length > 0) {
      return {
        status: 400,
        data: { message: 'Vous avez déjà une réservation pour cette période. Un utilisateur ne peut pas avoir plusieurs réservations le même jour.' }
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
        data: { message: 'Cette place de parking n\'est pas disponible pour les dates sélectionnées.' }
      };
    }

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
