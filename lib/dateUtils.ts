export function parseISO(dateString: string): Date {
  return new Date(dateString);
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  
  return date > now && date <= weekFromNow && !isToday(date) && !isTomorrow(date);
}

export function isThisMonth(date: Date): boolean {
  const now = new Date();
  const monthFromNow = new Date();
  monthFromNow.setDate(monthFromNow.getDate() + 30);
  
  return date > now && date <= monthFromNow && !isThisWeek(date);
}