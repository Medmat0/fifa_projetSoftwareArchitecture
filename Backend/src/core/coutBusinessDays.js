export function countBusinessDays(start, end) {
  let count = 0;
  let current = new Date(start);
  end = new Date(end);

  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { 
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

