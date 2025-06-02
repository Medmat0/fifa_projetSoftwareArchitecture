import { PrismaClient } from '@prisma/client';
import { generateQRCode } from '../../../../core/generateQR.js';
const prisma = new PrismaClient();

export async function getCurrentReservationService(userId) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservation = await prisma.reservation.findFirst({
      where: {
        userId,
        startDate: {
          lte: tomorrow
        },
        endDate: {
          gte: today
        }
      }
    });

    if (!reservation) {
      return {
        status: 404,
        data: { message: "Aucune réservation trouvée pour aujourd'hui" }
      };
    }

    const qrCode = await generateQRCode(reservation.id);

    return {
      status: 200,
      data: {
        reservation,
        qrCode
      }
    };
  } catch (error) {
    console.error("Error fetching current day reservation:", error);
    return {
      status: 500,
      data: { message: "Erreur lors de la récupération de la réservation" }
    };
  }
}
