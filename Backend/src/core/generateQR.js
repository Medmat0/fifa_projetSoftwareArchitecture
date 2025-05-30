import QRCode from 'qrcode';

/**
 * @desc    Generate a QR code for a reservation
 * @param   {string} reservationId
 * @returns {Promise<string>} QR code data URL
 */
export const generateQRCode = async (reservationId) => {
  try {
    // L'URL pourrait pointer vers l'endpoint de check-in de votre API
    const checkInUrl = `http://localhost:3000/reservations/${reservationId}/check-in`;
    return await QRCode.toDataURL(checkInUrl);
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};