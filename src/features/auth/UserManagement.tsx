import { useState } from "react";
import { Activity, Ban, CheckCircle2, LockKeyhole, UnlockKeyhole, UserRound, X } from "lucide-react";
import { FloorReport } from "../reports/types";
import { Trailer } from "../trailers/trailer.types";
import { AppUser } from "./auth.types";
import { getAccountAccessState, isUserLocked } from "./auth.utils";

type Props = {
  users: AppUser[];
  reports: FloorReport[];
  trailers: Trailer[];
  currentUserId: string;
  onSetActive: (id: string, active: boolean) => void;
  onBlock: (id: string) => void;
  onUnlock: (id: string) => void;
};

export function UserManagement({ users, reports, trailers, currentUserId, onSetActive, onBlock, onUnlock }: Props) {
  const [selectedId, setSelectedId] = useState<string>();
  const selected = users.find(user => user.id === selectedId);
  return <section className="userPanel"><div><h2>Users</h2><p>Manage prototype account access and review recorded activity.</p></div><div className="userList">{users.map(user => { const accessState = getAccountAccessState(user); const locked = isUserLocked(user); return <article className="userCard" key={user.id}><button className="userOpenBtn" onClick={() => setSelectedId(user.id)}><UserRound size={21}/><span><b>{user.displayName}</b><small>@{user.username}</small></span></button><dl><div><dt>Role</dt><dd>{user.role.replace("_", " ")}</dd></div><div><dt>Account</dt><dd className={user.active ? "activeText" : "lockedText"}>{user.active ? "Active" : "Inactive"}</dd></div><div><dt>Access</dt><dd className={locked || !user.active ? "lockedText" : "activeText"}>{formatAccessState(accessState)}</dd></div><div><dt>Failed</dt><dd>{user.failedLoginAttempts}</dd></div></dl><button className="detailsBtn" onClick={() => setSelectedId(user.id)}>View user</button></article> })}</div>{selected && <UserDetails user={selected} currentUserId={currentUserId} reports={reports} trailers={trailers} onClose={() => setSelectedId(undefined)} onSetActive={onSetActive} onBlock={onBlock} onUnlock={onUnlock}/>}</section>;
}

function UserDetails({ user, currentUserId, reports, trailers, onClose, onSetActive, onBlock, onUnlock }: { user: AppUser; currentUserId: string; reports: FloorReport[]; trailers: Trailer[]; onClose: () => void; onSetActive: (id: string, active: boolean) => void; onBlock: (id: string) => void; onUnlock: (id: string) => void }) {
  const locked = isUserLocked(user);
  const accessState = getAccountAccessState(user);
  const activities = [
    ...reports.filter(report => report.createdBy === user.displayName).map(report => ({ label: `Created report ${report.id}`, time: report.createdAt })),
    ...reports.filter(report => report.completedBy === user.displayName && report.completedAt).map(report => ({ label: `Completed report ${report.id}`, time: report.completedAt! })),
    ...trailers.flatMap(trailer => [
      trailer.driverInBy === user.displayName && trailer.driverInAt ? { label: `Driver In · ${trailer.loadNumber}`, time: `${trailer.date} ${trailer.driverInAt}` } : undefined,
      trailer.loadedBy === user.displayName && trailer.loadedAt ? { label: `Loaded / ready · ${trailer.loadNumber}`, time: `${trailer.date} ${trailer.loadedAt}` } : undefined,
      trailer.leftSiteBy === user.displayName && trailer.leftSiteAt ? { label: `Left Site · ${trailer.loadNumber}`, time: `${trailer.date} ${trailer.leftSiteAt}` } : undefined,
    ].filter((activity): activity is { label: string; time: string } => Boolean(activity))),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 8);

  return <div className="detailsBackdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}><section className="reportDetails userDetails" role="dialog" aria-modal="true" aria-labelledby="user-details-title"><div className="formTitle"><div><span className="eyebrow">USER ACCOUNT</span><h2 id="user-details-title">{user.displayName}</h2><p>@{user.username}</p></div><button className="closeBtn" onClick={onClose} aria-label="Close user details"><X size={22}/></button></div><dl className="reportMeta"><div><dt>Role</dt><dd>{user.role.replace("_", " ")}</dd></div><div><dt>Account</dt><dd>{user.active ? "Active" : "Inactive"}</dd></div><div><dt>Access status</dt><dd>{formatAccessState(accessState)}</dd></div><div><dt>Failed attempts</dt><dd>{user.failedLoginAttempts}</dd></div><div><dt>Last login</dt><dd>{formatDate(user.lastLoginAt)}</dd></div><div><dt>Last unlock</dt><dd>{formatDate(user.unlockedAt)}</dd></div><div><dt>Unlocked by</dt><dd>{user.unlockedBy ?? "—"}</dd></div></dl><div className="accountActions"><button className="secondaryBtn" disabled={user.id === currentUserId} onClick={() => onSetActive(user.id, !user.active)}>{user.active ? <><Ban size={17}/>Deactivate</> : <><CheckCircle2 size={17}/>Activate</>}</button>{locked ? <button className="unlockBtn" onClick={() => onUnlock(user.id)}><UnlockKeyhole size={17}/>Unlock account</button> : <button className="blockBtn" disabled={user.id === currentUserId} onClick={() => onBlock(user.id)}><LockKeyhole size={17}/>Block account</button>}</div><div className="activitySection"><h3><Activity size={18}/>Recent activity</h3>{activities.length ? <ul>{activities.map((activity, index) => <li key={`${activity.label}-${index}`}><b>{activity.label}</b><span>{formatActivityTime(activity.time)}</span></li>)}</ul> : <p>No recorded activity in this prototype session.</p>}</div></section></div>;
}

const formatDate = (value?: string) => value ? new Date(value).toLocaleString() : "—";
const formatActivityTime = (value: string) => value.includes("T") ? new Date(value).toLocaleString() : value;
const formatAccessState = (state: ReturnType<typeof getAccountAccessState>) => ({ ACTIVE: "Available", INACTIVE: "Inactive", TEMPORARILY_LOCKED: "Temporarily Locked", MANUALLY_BLOCKED: "Manually Blocked" })[state];
