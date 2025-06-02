import { PrismaClient } from '@prisma/client';
import { generateQRCode } from '../../../../core/generateQR.js';
const prisma = new PrismaClient();

export async function getAllReservationsService(userId) {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { 
        userId,
        endDate: {
          gte: new Date()
        }
      },
      orderBy: { startDate: 'asc' }
    });

    // Générer les QR codes pour chaque réservation
    const reservationsWithQR = await Promise.all(
      reservations.map(async (reservation) => {
        const qrCode = await generateQRCode(reservation.id);
        return {
          reservation,
          qrCode
        };
      })
    );

    return {
      status: 200,
      data: reservationsWithQR
    };
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    return {
      status: 500,
      data: { message: "Erreur lors de la récupération des réservations" }
    };
  }
}
