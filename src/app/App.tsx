import { useMemo, useState } from "react";
import { Camera, LogOut, Plus, Shield, Truck, Upload } from "lucide-react";
import { seedReports, seedTrailers } from "../data/seedData";
import { TrailerBoard } from "../features/trailers/TrailerBoard";
import { Trailer } from "../features/trailers/trailer.types";
import { ReportIssueForm } from "../features/reports/ReportIssueForm";
import { ReportList } from "../features/reports/ReportList";
import { nextReportId } from "../features/reports/report.utils";
import { FloorReport, NewFloorReport } from "../features/reports/types";

type Role = "bay" | "admin";
type Tab = "trailers" | "reports" | "admin";

export function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pin, setPin] = useState("");
  const [role, setRole] = useState<Role>("bay");
  const [tab, setTab] = useState<Tab>("trailers");
  const [showReportForm, setShowReportForm] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>(seedTrailers);
  const [reports, setReports] = useState<FloorReport[]>(seedReports);
  const pendingCount = useMemo(() => reports.filter(report => report.status === "PENDING").length, [reports]);

  const updateTrailer = (id: number, patch: Partial<Trailer>) => setTrailers(current => current.map(trailer => trailer.id === id ? { ...trailer, ...patch } : trailer));
  const createReport = (input: NewFloorReport) => {
    setReports(current => [{ ...input, id: nextReportId(current), createdAt: new Date().toISOString(), createdBy: role === "admin" ? "Logistics Admin" : "Bay Operator", status: "PENDING" }, ...current]);
    setShowReportForm(false);
  };
  const completeReport = (id: string) => setReports(current => current.map(report => report.id === id ? { ...report, status: "COMPLETED", completedAt: new Date().toISOString(), completedBy: "Logistics Admin" } : report));

  if (!loggedIn) return <div className="loginPage"><div className="loginCard">
    <div className="brandMark"><Truck size={28}/></div><h1>BayFlow</h1><p>Trailer tracking and floor reports</p>
    <label htmlFor="pin">PIN</label><input id="pin" inputMode="numeric" maxLength={4} placeholder="••••" value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, ""))}/>
    <div className="roleSwitch"><button className={role === "bay" ? "active" : ""} onClick={() => setRole("bay")}>Bay</button><button className={role === "admin" ? "active" : ""} onClick={() => setRole("admin")}>Admin</button></div>
    <button className="primary" disabled={pin.length < 4} onClick={() => setLoggedIn(true)}>Sign in</button><small>Prototype: any 4-digit PIN works.</small>
  </div></div>;

  return <div className="appShell">
    <header><div><strong>BayFlow</strong><span>{role === "admin" ? "Admin" : "Bay Operator"}</span></div><button className="iconBtn" onClick={() => setLoggedIn(false)} title="Sign out"><LogOut size={20}/></button></header>
    <nav><button className={tab === "trailers" ? "active" : ""} onClick={() => setTab("trailers")}><Truck size={18}/>Trailers</button><button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}><Camera size={18}/>Reports {pendingCount > 0 && <b>{pendingCount}</b>}</button>{role === "admin" && <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}><Shield size={18}/>Admin</button>}</nav>
    <main>
      {tab === "trailers" && <TrailerBoard trailers={trailers} canOperate={role === "bay"} onUpdate={updateTrailer}/>} 
      {tab === "reports" && <><section className="sectionHead"><div><h2>Floor reports</h2><p>Report anything wrong on the floor. Reports do not block trailer work.</p></div>{!showReportForm && <button className="primary compact" onClick={() => setShowReportForm(true)}><Plus size={17}/>Report issue</button>}</section>{showReportForm && <ReportIssueForm onCancel={() => setShowReportForm(false)} onSubmit={createReport}/>}<ReportList reports={reports} canComplete={role === "admin"} onComplete={completeReport}/></>}
      {tab === "admin" && role === "admin" && <AdminPlanning trailers={trailers} onUpdate={updateTrailer}/>} 
    </main><footer>Prototype only · no company data connected</footer>
  </div>;
}

function AdminPlanning({ trailers, onUpdate }: { trailers: Trailer[]; onUpdate: (id: number, patch: Partial<Trailer>) => void }) {
  return <><section className="sectionHead"><div><h2>Admin planning</h2><p>Upload or edit booked trailer times and planned pallet quantities.</p></div></section><div className="adminPanel"><div className="uploadBox"><Upload size={28}/><h3>Upload daily trailer plan</h3><p>CSV / Excel import will be wired in next.</p><button disabled>Choose file</button></div><div className="adminTableWrap"><table><thead><tr><th>Trailer</th><th>Booked</th><th>Carrier</th><th>Planned pallets</th><th>Status</th></tr></thead><tbody>{trailers.map(trailer => <tr key={trailer.id}><td>{trailer.id}</td><td><input aria-label={`Trailer ${trailer.id} booked time`} value={trailer.bookedTime} onChange={event => onUpdate(trailer.id, { bookedTime: event.target.value })}/></td><td><input aria-label={`Trailer ${trailer.id} carrier`} value={trailer.carrier} onChange={event => onUpdate(trailer.id, { carrier: event.target.value })}/></td><td><input aria-label={`Trailer ${trailer.id} planned pallets`} type="number" value={trailer.plannedPallets} onChange={event => onUpdate(trailer.id, { plannedPallets: Number(event.target.value) })}/></td><td>{trailer.status.replace("_", " ")}</td></tr>)}</tbody></table></div></div></>;
}
