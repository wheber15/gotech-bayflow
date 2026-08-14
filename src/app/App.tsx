import { useMemo, useState } from "react";
import { Camera, LogOut, Plus, Shield, Truck, Upload } from "lucide-react";
import { seedReports, seedTrailers } from "../data/seedData";
import { TrailerBoard } from "../features/trailers/TrailerBoard";
import { Trailer } from "../features/trailers/trailer.types";
import { ReportIssueForm } from "../features/reports/ReportIssueForm";
import { ReportList } from "../features/reports/ReportList";
import { nextReportId } from "../features/reports/report.utils";
import { FloorReport, NewFloorReport } from "../features/reports/types";
import { LoginScreen } from "../features/auth/LoginScreen";
import { UserManagement } from "../features/auth/UserManagement";
import { AppUser, LoginCredentials, LoginKind } from "../features/auth/auth.types";
import { attemptLogin, unlockUser } from "../features/auth/auth.utils";
import { mockUsers } from "../features/auth/mockUsers";

type Tab = "trailers" | "reports" | "admin";

export function App() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<AppUser>();
  const [tab, setTab] = useState<Tab>("trailers");
  const [showReportForm, setShowReportForm] = useState(false);
  const [trailers, setTrailers] = useState<Trailer[]>(seedTrailers);
  const [reports, setReports] = useState<FloorReport[]>(seedReports);
  const pendingCount = useMemo(() => reports.filter(report => report.status === "PENDING").length, [reports]);
  const isAdmin = currentUser?.role === "ADMIN";

  const updateTrailer = (id: number, patch: Partial<Trailer>) => setTrailers(current => current.map(trailer => trailer.id === id ? { ...trailer, ...patch } : trailer));
  const createReport = (input: NewFloorReport) => {
    setReports(current => [{ ...input, id: nextReportId(current), createdAt: new Date().toISOString(), createdBy: currentUser?.displayName ?? "Unknown user", status: "PENDING" }, ...current]);
    setShowReportForm(false);
  };
  const completeReport = (id: string) => setReports(current => current.map(report => report.id === id ? { ...report, status: "COMPLETED", completedAt: new Date().toISOString(), completedBy: currentUser?.displayName ?? "Unknown admin" } : report));
  const login = (kind: LoginKind, credentials: LoginCredentials) => {
    const result = attemptLogin(users, kind, credentials);
    setUsers(result.users);
    if (result.user) { setCurrentUser(result.user); setTab("trailers") }
    return result.error;
  };
  const signOut = () => { setCurrentUser(undefined); setTab("trailers"); setShowReportForm(false) };
  const manuallyUnlockUser = (id: string) => { if (currentUser) setUsers(current => unlockUser(current, id, currentUser)) };

  if (!currentUser) return <LoginScreen onLogin={login}/>;

  return <div className="appShell">
    <header><div><strong>BayFlow</strong><span>{currentUser.displayName} · {isAdmin ? "Admin" : "Bay Operator"}</span></div><button className="iconBtn" onClick={signOut} title="Sign out"><LogOut size={20}/></button></header>
    <nav><button className={tab === "trailers" ? "active" : ""} onClick={() => setTab("trailers")}><Truck size={18}/>Trailers</button><button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}><Camera size={18}/>Reports {pendingCount > 0 && <b>{pendingCount}</b>}</button>{isAdmin && <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}><Shield size={18}/>Admin</button>}</nav>
    <main>
      {tab === "trailers" && <TrailerBoard trailers={trailers} canOperate={!isAdmin} onUpdate={updateTrailer}/>} 
      {tab === "reports" && <><section className="sectionHead"><div><h2>Floor reports</h2><p>Report anything wrong on the floor. Reports do not block trailer work.</p></div>{!showReportForm && <button className="primary compact" onClick={() => setShowReportForm(true)}><Plus size={17}/>Report issue</button>}</section>{showReportForm && <ReportIssueForm onCancel={() => setShowReportForm(false)} onSubmit={createReport}/>}<ReportList reports={reports} canComplete={isAdmin} onComplete={completeReport}/></>}
      {tab === "admin" && isAdmin && <><AdminPlanning trailers={trailers} onUpdate={updateTrailer}/><UserManagement users={users} onUnlock={manuallyUnlockUser}/></>} 
    </main><footer>Client-side prototype only · no production authentication</footer>
  </div>;
}

function AdminPlanning({ trailers, onUpdate }: { trailers: Trailer[]; onUpdate: (id: number, patch: Partial<Trailer>) => void }) {
  return <><section className="sectionHead"><div><h2>Admin planning</h2><p>Upload or edit booked trailer times and planned pallet quantities.</p></div></section><div className="adminPanel"><div className="uploadBox"><Upload size={28}/><h3>Upload daily trailer plan</h3><p>CSV / Excel import will be wired in next.</p><button disabled>Choose file</button></div><div className="adminTableWrap"><table><thead><tr><th>Trailer</th><th>Booked</th><th>Carrier</th><th>Planned pallets</th><th>Status</th></tr></thead><tbody>{trailers.map(trailer => <tr key={trailer.id}><td>{trailer.id}</td><td><input aria-label={`Trailer ${trailer.id} booked time`} value={trailer.bookedTime} onChange={event => onUpdate(trailer.id, { bookedTime: event.target.value })}/></td><td><input aria-label={`Trailer ${trailer.id} carrier`} value={trailer.carrier} onChange={event => onUpdate(trailer.id, { carrier: event.target.value })}/></td><td><input aria-label={`Trailer ${trailer.id} planned pallets`} type="number" value={trailer.plannedPallets} onChange={event => onUpdate(trailer.id, { plannedPallets: Number(event.target.value) })}/></td><td>{trailer.status.replace("_", " ")}</td></tr>)}</tbody></table></div></div></>;
}
