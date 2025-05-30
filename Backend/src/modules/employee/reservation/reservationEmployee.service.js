import { ReservationService } from '../../reservationService.interface.js';
import { PrismaClient } from '@prisma/client';
import { countBusinessDays } from '../../../core/coutBusinessDays.js';
import { generateQRCode } from '../../../core/generateQR.js';
const prisma = new PrismaClient();

export class ReservationEmployeeService extends ReservationService {
  /**
   * @desc    Create a new parking reservation
   * @param   {string} userId
   * @param   {string} slotId
   * @param   {Date} startDate
   * @param   {Date} endDate
   * @returns {object} { status, data }
   */  async createReservation(userId, slotId, startDate, endDate, ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'EMPLOYEE') {
      return {
        status: 403,
        data: { message: 'Only employees can make reservations.' }
      };
    }

    // Get all active reservations for this user
    const userReservations = await prisma.reservation.findMany({
      where: {
        userId,
        endDate: {
          gte: new Date() 
        }
      }
    });    // Calculate total working days of existing reservations
    let totalWorkingDays = 0;
    for (const reservation of userReservations) {
      const reservationStart = new Date(reservation.startDate);
      reservationStart.setHours(8, 0, 0, 0); 
      const reservationEnd = new Date(reservation.endDate);
      reservationEnd.setHours(23, 0, 0, 0); 
      totalWorkingDays += countBusinessDays(reservationStart, reservationEnd);
    }

    const reservationStart = new Date(startDate);
    reservationStart.setHours(8, 0, 0, 0); 
    const reservationEnd = new Date(endDate);
    reservationEnd.setHours(23, 0, 0, 0); 
    const newReservationDays = countBusinessDays(reservationStart, reservationEnd);

    console.log('Total working days:', totalWorkingDays);
    console.log('New reservation days:', newReservationDays);
    
    if (totalWorkingDays + newReservationDays > 5) {
      return {
        status: 400,
        data: { message: 'La somme totale de vos réservations ne peut pas dépasser 5 jours ouvrables.' }
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

    // Check if the slot is available for these dates
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

   const qrCode = await generateQRCode(reservation.id);


    return {
      status: 200,
      data: { reservation , qrCode }
    };
  }
}
