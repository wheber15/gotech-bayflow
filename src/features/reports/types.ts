export const REPORT_CATEGORIES = [
  ["PALLET_WRAPPING", "Poorly wrapped pallet"], ["LOOSE_PRODUCT", "Loose tins / products"],
  ["INCORRECT_PALLET", "Incorrect pallet"], ["OVERSIZED_PALLET", "Oversized pallet"],
  ["PICKING", "Picking issue"], ["PRODUCT", "Product issue"], ["EQUIPMENT", "Equipment issue"],
  ["ABANDONED_PALLET", "Pallet abandoned in bay"], ["HOUSEKEEPING", "Housekeeping issue"],
  ["LOADING", "Loading issue"], ["SAFETY", "Safety issue"], ["OTHER", "Other operational issue"],
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number][0];
export type ReportPhoto = { id: string; name: string; objectUrl: string };
export type FloorReport = {
  id: string; category: ReportCategory; area: string; reference?: string; description: string;
  photos: ReportPhoto[]; createdBy: string; createdAt: string; status: "PENDING" | "COMPLETED";
  completedAt?: string; completedBy?: string;
};
export type NewFloorReport = Pick<FloorReport, "category" | "area" | "reference" | "description" | "photos">;
export const categoryLabel = (category: ReportCategory) => REPORT_CATEGORIES.find(([value]) => value === category)?.[1] ?? category;
export const formatReportDate = (timestamp: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(timestamp));
