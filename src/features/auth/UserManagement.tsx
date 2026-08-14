import { LockKeyhole, UnlockKeyhole } from "lucide-react";
import { AppUser } from "./auth.types";
import { isUserLocked } from "./auth.utils";

export function UserManagement({ users, onUnlock }: { users: AppUser[]; onUnlock: (id: string) => void }) {
  return <section className="userPanel"><div><h3>Prototype users</h3><p>Account state is held in this browser session only.</p></div><div className="userList">{users.map(user => { const locked = isUserLocked(user); return <article className="userCard" key={user.id}><div><b>{user.displayName}</b><span>@{user.username}</span></div><dl><div><dt>Role</dt><dd>{user.role.replace("_", " ")}</dd></div><div><dt>Active</dt><dd>{user.active ? "Yes" : "No"}</dd></div><div><dt>Status</dt><dd className={locked ? "lockedText" : "activeText"}>{locked ? <><LockKeyhole size={15}/>Locked</> : "Available"}</dd></div><div><dt>Failed attempts</dt><dd>{user.failedLoginAttempts}</dd></div></dl>{user.unlockedAt && <small>Unlocked by {user.unlockedBy} at {new Date(user.unlockedAt).toLocaleString()}</small>}{locked && <button className="unlockBtn" onClick={() => onUnlock(user.id)}><UnlockKeyhole size={17}/>Unlock user</button>}</article> })}</div></section>;
}
