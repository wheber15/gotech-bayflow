import { FloorReport } from "../features/reports/types";
import { Trailer } from "../features/trailers/trailer.types";
import { shiftOperationalDate, toOperationalDate } from "../features/trailers/trailer.utils";
const today = toOperationalDate();
const yesterday = shiftOperationalDate(today, -1);
const tomorrow = shiftOperationalDate(today, 1);
export const seedTrailers: Trailer[] = [
  { id: 1, date: yesterday, loadNumber: "LD-090", bookedTime: "07:00", carrier: "Northline Test", plannedPallets: 24, actualPallets: 23, status: "LEFT_SITE", driverInAt: "07:10", loadedAt: "07:42", leftSiteAt: "08:05" },
  { id: 2, date: yesterday, loadNumber: "LD-091", bookedTime: "11:00", carrier: "Demo Freight", plannedPallets: 18, actualPallets: 18, status: "LEFT_SITE", driverInAt: "11:05", loadedAt: "11:38", leftSiteAt: "12:00" },
  { id: 3, date: today, loadNumber: "LD-100", bookedTime: "07:00", carrier: "Northline Test", plannedPallets: 26, status: "LEFT_SITE", driverInAt: "07:20", loadedAt: "07:35", leftSiteAt: "07:40" },
  { id: 4, date: today, loadNumber: "LD-101", bookedTime: "09:00", carrier: "Demo Freight", plannedPallets: 26, status: "LOADED", driverInAt: "09:15", loadedAt: "09:40", actualPallets: 26, door: "2" },
  ...["11:00", "13:00", "15:00"].map((bookedTime, index) => ({ id: index + 5, date: today, loadNumber: `LD-${102 + index}`, bookedTime, carrier: "Sample Logistics", plannedPallets: 26, status: "BOOKED" as const })),
  { id: 8, date: tomorrow, loadNumber: "LD-110", bookedTime: "08:00", carrier: "Demo Freight", plannedPallets: 22, status: "BOOKED" },
  { id: 9, date: tomorrow, loadNumber: "LD-111", bookedTime: "12:30", carrier: "Northline Test", plannedPallets: 26, status: "BOOKED" },
];
export const seedReports: FloorReport[] = [{ id: "RPT-0001", createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), category: "PALLET_WRAPPING", area: "Bay", reference: "Route 104", description: "Pallet badly wrapped; tins were loose.", createdBy: "Bay Operator", status: "PENDING", photos: [] }];
