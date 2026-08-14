import { FormEvent, useState } from "react";
import { ArrowLeft, Shield, Truck } from "lucide-react";
import { LoginCredentials, LoginKind } from "./auth.types";

type Props = { onLogin: (kind: LoginKind, credentials: LoginCredentials) => string | undefined };

export function LoginScreen({ onLogin }: Props) {
  const [kind, setKind] = useState<LoginKind>();
  if (!kind) return <div className="loginPage"><div className="entryCard"><div className="brandMark"><Truck size={28}/></div><h1>BayFlow</h1><p>Choose the secure entry for your work area.</p><div className="loginChoices"><button className="bayChoice" onClick={() => setKind("bay")}><Truck size={28}/><span><b>Bay Login</b><small>Operators on phones and tablets</small></span></button><button className="adminChoice" onClick={() => setKind("admin")}><Shield size={28}/><span><b>Admin Login</b><small>Logistics office users</small></span></button></div><small className="prototypeNote">Client-side prototype authentication only.</small></div></div>;
  return <LoginForm kind={kind} onBack={() => setKind(undefined)} onLogin={onLogin}/>;
}

function LoginForm({ kind, onBack, onLogin }: { kind: LoginKind; onBack: () => void; onLogin: Props["onLogin"] }) {
  const [username, setUsername] = useState(""); const [secret, setSecret] = useState(""); const [error, setError] = useState<string>();
  const isBay = kind === "bay";
  const submit = (event: FormEvent) => { event.preventDefault(); const loginError = onLogin(kind, { username, secret }); setError(loginError); if (loginError) setSecret("") };
  return <div className={`loginPage ${isBay ? "bayLoginPage" : "adminLoginPage"}`}><div className={`loginCard ${isBay ? "bayLoginCard" : "adminLoginCard"}`}>
    <button className="backBtn" type="button" onClick={onBack}><ArrowLeft size={18}/>Back</button><div className="brandMark">{isBay ? <Truck size={28}/> : <Shield size={28}/>}</div><h1>{isBay ? "Bay Login" : "Admin Login"}</h1><p>{isBay ? "Fast operator access" : "Logistics office access"}</p>
    <form className="loginForm" onSubmit={submit}><label htmlFor={`${kind}-username`}>Username</label><input id={`${kind}-username`} autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} autoCapitalize="none"/>
      <label htmlFor={`${kind}-secret`}>{isBay ? "6-digit PIN" : "Password"}</label><input id={`${kind}-secret`} type="password" inputMode={isBay ? "numeric" : "text"} autoComplete={isBay ? "one-time-code" : "current-password"} maxLength={isBay ? 6 : undefined} value={secret} onChange={event => setSecret(isBay ? event.target.value.replace(/\D/g, "") : event.target.value)}/>
      {error && <div className="loginError" role="alert">{error}</div>}<button className="primary" disabled={!username.trim() || (isBay ? secret.length !== 6 : !secret)}>{isBay ? "Sign in to Bay" : "Sign in to Admin"}</button>
    </form><small>Prototype accounts only. No production security.</small>
  </div></div>;
}
