/** Horario de atención / pedidos: 20:00 a 00:30 (todos los días). */
export const OPEN_MINUTES = 20 * 60; // 20:00
export const CLOSE_MINUTES = 30; // 00:30 del día siguiente
export const HOURS_LABEL = "20:00 a 00:30";
export const HOURS_LABEL_FULL = "Lun a Dom · 20:00 a 00:30";

/** true si la hora dada está dentro del rango de pedidos (rango que cruza medianoche). */
export function isWithinServiceHours(date: Date = new Date()): boolean {
  const m = date.getHours() * 60 + date.getMinutes();
  return m >= OPEN_MINUTES || m <= CLOSE_MINUTES;
}

export function isOrderInServiceHours(isoDate: string): boolean {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  return isWithinServiceHours(d);
}
