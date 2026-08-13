import { FloorReport } from "./types";
export function nextReportId(reports: FloorReport[]) {
  const next = reports.reduce((max, report) => Math.max(max, Number(report.id.replace(/^RPT-/, "")) || 0), 0) + 1;
  return `RPT-${String(next).padStart(4, "0")}`;
}
