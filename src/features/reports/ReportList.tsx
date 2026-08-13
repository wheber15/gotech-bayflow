import { useState } from "react";
import { Camera, CheckCircle2, ChevronRight, X } from "lucide-react";
import { categoryLabel, FloorReport, formatReportDate } from "./types";
type Props = { reports: FloorReport[]; canComplete: boolean; onComplete: (id: string) => void };

export function ReportList({ reports, canComplete, onComplete }: Props) {
  const [selectedId, setSelectedId] = useState<string>();
  const selected = reports.find(report => report.id === selectedId);
  return <><div className="reportList">{reports.map(report => <article className="reportCard reportSummary" key={report.id}>
    <div className="reportHeader"><div><span className="eyebrow">{report.id}</span><h3>{categoryLabel(report.category)}</h3></div><span className={`reportStatus ${report.status.toLowerCase()}`}>{report.status}</span></div>
    <div className="summaryLine"><b>{report.area}</b><span>{formatReportDate(report.createdAt)}</span><span>Reported by {report.createdBy}</span></div>
    <button className="detailsBtn" onClick={() => setSelectedId(report.id)}>View details <ChevronRight size={18}/></button>
  </article>)}</div>{selected && <ReportDetails report={selected} canComplete={canComplete} onClose={() => setSelectedId(undefined)} onComplete={() => onComplete(selected.id)}/>}</>;
}

function ReportDetails({ report, canComplete, onClose, onComplete }: { report: FloorReport; canComplete: boolean; onClose: () => void; onComplete: () => void }) {
  return <div className="detailsBackdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="reportDetails" role="dialog" aria-modal="true" aria-labelledby="report-details-title">
    <div className="formTitle"><div><span className="eyebrow">{report.id}</span><h2 id="report-details-title">{categoryLabel(report.category)}</h2></div><button className="closeBtn" onClick={onClose} aria-label="Close report details"><X size={22}/></button></div><span className={`reportStatus ${report.status.toLowerCase()}`}>{report.status}</span>
    <dl className="reportMeta"><div><dt>Area</dt><dd>{report.area}</dd></div>{report.reference && <div><dt>Reference</dt><dd>{report.reference}</dd></div>}<div><dt>Reported by</dt><dd>{report.createdBy}</dd></div><div><dt>Created</dt><dd>{formatReportDate(report.createdAt)}</dd></div></dl>
    <div className="reportDescription"><span>Description</span><p>{report.description}</p></div>
    {report.photos.length ? <div className="reportPhotos">{report.photos.map(photo => <a key={photo.id} href={photo.objectUrl} target="_blank" rel="noreferrer"><img src={photo.objectUrl} alt={photo.name}/></a>)}</div> : <div className="photoPlaceholder"><Camera size={21}/><span>No photographs attached</span></div>}
    {report.status === "COMPLETED" && <div className="completionNote"><CheckCircle2 size={18}/><span>Completed by <b>{report.completedBy}</b> on {formatReportDate(report.completedAt!)}</span></div>}
    {canComplete && report.status === "PENDING" && <button className="completeBtn" onClick={onComplete}><CheckCircle2 size={17}/>Mark completed</button>}
  </section></div>;
}
