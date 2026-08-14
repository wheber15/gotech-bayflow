import { FormEvent, KeyboardEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Shield, Truck } from "lucide-react";
import { LoginCredentials, LoginKind } from "./auth.types";

type Props = { onLogin: (kind: LoginKind, credentials: LoginCredentials) => string | undefined };

export function LoginScreen({ onLogin }: Props) {
  const [kind, setKind] = useState<LoginKind>();
  if (!kind) return <div className="loginPage"><main className="entryCard"><div className="entryBrand"><div className="brandMark"><Truck size={27}/></div><span>GOTech / BayFlow</span></div><h1>Operations access</h1><p>Select the area you need to sign in to.</p><div className="loginChoices"><button className="bayChoice" onClick={() => setKind("bay")}><Truck size={27}/><span><b>Bay Operator</b><small>Fast mobile access</small></span></button><button className="adminChoice" onClick={() => setKind("admin")}><Shield size={27}/><span><b>Admin / Logistics</b><small>Office and management access</small></span></button></div><small className="prototypeNote">Prototype access · server enforcement not yet connected</small></main></div>;
  return <LoginForm key={kind} kind={kind} onBack={() => setKind(undefined)} onLogin={onLogin}/>;
}

function LoginForm({ kind, onBack, onLogin }: { kind: LoginKind; onBack: () => void; onLogin: Props["onLogin"] }) {
  const [username, setUsername] = useState(""); const [secret, setSecret] = useState(""); const [error, setError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false); const [capsLock, setCapsLock] = useState(false);
  const isBay = kind === "bay";
  const submit = (event: FormEvent) => { event.preventDefault(); const loginError = onLogin(kind, { username, secret }); setError(loginError); if (loginError) setSecret("") };
  const detectCapsLock = (event: KeyboardEvent<HTMLInputElement>) => { if (!isBay) setCapsLock(event.getModifierState("CapsLock")) };
  return <div className={`loginPage ${isBay ? "bayLoginPage" : "adminLoginPage"}`}><main className={`loginCard ${isBay ? "bayLoginCard" : "adminLoginCard"}`}>
    <button className="backBtn" type="button" onClick={onBack}><ArrowLeft size={18}/>Back to access selection</button><div className="loginHeading"><div className="brandMark">{isBay ? <Truck size={27}/> : <Shield size={27}/>}</div><div><span className="eyebrow">GOTECH / BAYFLOW</span><h1>{isBay ? "Bay Operator" : "Admin / Logistics"}</h1><p>{isBay ? "Operational access" : "Office and management access"}</p></div></div>
    <form className="loginForm" onSubmit={submit}><label htmlFor={`${kind}-username`}>Username</label><input id={`${kind}-username`} autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} autoCapitalize="none" spellCheck={false}/>
      <label htmlFor={`${kind}-secret`}>{isBay ? "6-digit PIN" : "Password"}</label><div className={isBay ? undefined : "passwordField"}><input id={`${kind}-secret`} type={isBay || !showPassword ? "password" : "text"} inputMode={isBay ? "numeric" : "text"} autoComplete={isBay ? "off" : "current-password"} maxLength={isBay ? 6 : undefined} value={secret} onKeyUp={detectCapsLock} onKeyDown={detectCapsLock} onBlur={() => setCapsLock(false)} onChange={event => setSecret(isBay ? event.target.value.replace(/\D/g, "") : event.target.value)}/>{!isBay && <button type="button" className="passwordToggle" onClick={() => setShowPassword(current => !current)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button>}</div>
      {capsLock && <div className="capsWarning">Caps Lock is on</div>}{error && <div className="loginError" role="alert">{error}</div>}<button className="primary loginSubmit" disabled={!username.trim() || (isBay ? secret.length !== 6 : !secret)}>{isBay ? "Sign in to Bay" : "Sign in to Admin"}</button>
    </form><small className="securityNote">Client-side prototype authentication only.</small>
  </main></div>;
}
