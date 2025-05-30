// reservationService.interface.js
// Interface for reservation services

/**
 * @interface ReservationService
 * @function createReservation
 * @param {string} userId
 * @param {string} slotId
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {boolean} halfDay
 * @returns {Promise<{status: number, data: object}>}
 */
export class ReservationService {
  async createReservation(userId, slotId, startDate, endDate) {
    throw new Error('Not implemented');
  }

  async deleteReservation(reservationId) {
    throw new Error('Not implemented');
  }
}
