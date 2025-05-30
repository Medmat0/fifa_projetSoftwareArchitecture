import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Renvoie les stats de réservation par jour, semaine et mois
 */
export async function getReservationStats() {
  // Toutes les réservations
  const reservations = await prisma.reservation.findMany({
    select: { id: true, startDate: true }
  });

  // Stats par jour
  const byDay = {};
  // Stats par semaine (année-semaine)
  const byWeek = {};
  // Stats par mois (année-mois)
  const byMonth = {};

  reservations.forEach(r => {
    const date = new Date(r.startDate);
    // Jour
    const dayKey = date.toISOString().slice(0, 10);
    byDay[dayKey] = (byDay[dayKey] || 0) + 1;

    // Semaine (année-semaine)
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const weekKey = `${year}-W${week}`;
    byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;

    // Mois (année-mois)
    const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
  });

  return { byDay, byWeek, byMonth };
}

// Helper pour numéro de semaine ISO
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}