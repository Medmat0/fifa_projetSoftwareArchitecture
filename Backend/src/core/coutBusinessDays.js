export function countBusinessDays(start, end) {
  let count = 0;
  const current = new Date(start);
  const endDate = new Date(end);
  
  // Reset time parts to compare only dates
  current.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  // Count working days
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

