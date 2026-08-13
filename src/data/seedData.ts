import { FloorReport } from "../features/reports/types";
import { Trailer } from "../features/trailers/trailer.types";
export const seedTrailers: Trailer[] = [
  { id: 1, bookedTime: "07:00", carrier: "Dachser", plannedPallets: 26, status: "LEFT_SITE", driverInAt: "07:20", loadedAt: "07:35", leftSiteAt: "07:40" },
  { id: 2, bookedTime: "09:00", carrier: "Dachser", plannedPallets: 26, status: "LOADED", driverInAt: "09:15", loadedAt: "09:40", actualPallets: 26, door: "2" },
  ...["11:00", "13:00", "15:00", "16:00", "17:00"].map((bookedTime, index) => ({ id: index + 3, bookedTime, carrier: "Dachser", plannedPallets: 26, status: "BOOKED" as const })),
];
export const seedReports: FloorReport[] = [{ id: "RPT-0001", createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), category: "PALLET_WRAPPING", area: "Bay", reference: "Route 104", description: "Pallet badly wrapped; tins were loose.", createdBy: "Bay Operator", status: "PENDING", photos: [] }];
