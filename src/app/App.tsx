import { useMemo, useState } from "react";
import { Camera, LogOut, Plus, Shield, Truck } from "lucide-react";
import { seedReports, seedTrailers } from "../data/seedData";
import { TrailerBoard } from "../features/trailers/TrailerBoard";
import { NewTrailer, Trailer } from "../features/trailers/trailer.types";
import { AdminPlanning } from "../features/trailers/AdminPlanning";
import { nextTrailerId } from "../features/trailers/trailer.utils";
import { ReportIssueForm } from "../features/reports/ReportIssueForm";
import { ReportList } from "../features/reports/ReportList";
import { nextReportId } from "../features/reports/report.utils";
import { FloorReport, NewFloorReport } from "../features/reports/types";
import { LoginScreen } from "../features/auth/LoginScreen";
import { UserManagement } from "../features/auth/UserManagement";
import { AppUser, LoginCredentials, LoginKind } from "../features/auth/auth.types";
import { attemptLogin, blockUser, setUserActive, unlockUser } from "../features/auth/auth.utils";
import { mockUsers } from "../features/auth/mockUsers";

type Tab = "trailers" | "reports" | "admin";
type AdminSection = "planning" | "users";

export function App() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<AppUser>();
  const [tab, setTab] = useState<Tab>("trailers");
  const [showReportForm, setShowReportForm] = useState(false);
  const [adminSection, setAdminSection] = useState<AdminSection>("planning");
  const [trailers, setTrailers] = useState<Trailer[]>(seedTrailers);
  const [reports, setReports] = useState<FloorReport[]>(seedReports);
  const pendingCount = useMemo(() => reports.filter(report => report.status === "PENDING").length, [reports]);
  const isAdmin = currentUser?.role === "ADMIN";

  const updateTrailer = (id: number, patch: Partial<Trailer>) => setTrailers(current => current.map(trailer => trailer.id === id ? { ...trailer, ...patch } : trailer));
  const createTrailer = (input: NewTrailer) => setTrailers(current => [...current, { ...input, id: nextTrailerId(current), status: "BOOKED" }]);
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
  const changeUserActive = (id: string, active: boolean) => setUsers(current => setUserActive(current, id, active));
  const manuallyBlockUser = (id: string) => setUsers(current => blockUser(current, id));

  if (!currentUser) return <LoginScreen onLogin={login}/>;

  return <div className="appShell">
    <header><div><strong>BayFlow</strong><span>{currentUser.displayName} · {isAdmin ? "Admin" : "Bay Operator"}</span></div><button className="iconBtn" onClick={signOut} title="Sign out"><LogOut size={20}/></button></header>
    <nav><button className={tab === "trailers" ? "active" : ""} onClick={() => setTab("trailers")}><Truck size={18}/>Trailers</button><button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}><Camera size={18}/>Reports {pendingCount > 0 && <b>{pendingCount}</b>}</button>{isAdmin && <button className={tab === "admin" ? "active" : ""} onClick={() => setTab("admin")}><Shield size={18}/>Admin</button>}</nav>
    <main>
      {tab === "trailers" && <TrailerBoard trailers={trailers} canOperate={!isAdmin} actorName={currentUser.displayName} onUpdate={updateTrailer}/>} 
      {tab === "reports" && <><section className="sectionHead"><div><h2>Floor reports</h2><p>Report anything wrong on the floor. Reports do not block trailer work.</p></div>{!showReportForm && <button className="primary compact" onClick={() => setShowReportForm(true)}><Plus size={17}/>Report issue</button>}</section>{showReportForm && <ReportIssueForm onCancel={() => setShowReportForm(false)} onSubmit={createReport}/>}<ReportList reports={reports} canComplete={isAdmin} onComplete={completeReport}/></>}
      {tab === "admin" && isAdmin && <section className="adminControl"><div className="sectionHead"><div><h2>Admin</h2><p>Operational planning and prototype account control.</p></div></div><div className="adminTabs" role="tablist" aria-label="Admin sections"><button role="tab" aria-selected={adminSection === "planning"} className={adminSection === "planning" ? "active" : ""} onClick={() => setAdminSection("planning")}>Planning</button><button role="tab" aria-selected={adminSection === "users"} className={adminSection === "users" ? "active" : ""} onClick={() => setAdminSection("users")}>Users</button></div>{adminSection === "planning" ? <AdminPlanning trailers={trailers} onUpdate={updateTrailer} onCreate={createTrailer}/> : <UserManagement users={users} reports={reports} trailers={trailers} currentUserId={currentUser.id} onSetActive={changeUserActive} onBlock={manuallyBlockUser} onUnlock={manuallyUnlockUser}/>}</section>} 
    </main><footer>Client-side prototype only · no production authentication</footer>
  </div>;
}
