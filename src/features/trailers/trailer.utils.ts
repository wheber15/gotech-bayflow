import { Trailer } from "./trailer.types";

export function toOperationalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftOperationalDate(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number);
  return toOperationalDate(new Date(year, month - 1, day + days));
}

export function formatOperationalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(year, month - 1, day));
}

export function nextTrailerId(trailers: Trailer[]) {
  return trailers.reduce((highest, trailer) => Math.max(highest, trailer.id), 0) + 1;
}
