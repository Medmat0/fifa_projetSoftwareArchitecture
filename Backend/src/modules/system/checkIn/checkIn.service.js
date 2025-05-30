import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function checkInReservationService(reservationId) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    return { status: 404, data: { message: "Reservation not found" } };
  }
  console.log("Checking in reservation:", reservationId);
  console.log("Reservation details:", reservation);
  const now = new Date();
  const startDate = new Date(reservation.startDate);

  if (
    now.getFullYear() !== startDate.getFullYear() ||
    now.getMonth() !== startDate.getMonth() ||
    now.getDate() !== startDate.getDate()
  ) {
    return { status: 400, data: { message: "Check-in only possible on the reservation day." } };
  }
  if (now.getHours() >= 11) {
    return { status: 400, data: { message: "Check-in must be done before 11:00 AM." } };
  }
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { checkInTime: now }
  });
  return { status: 200, data: { message: "Check-in successful." } };
}

export { checkInReservationService };