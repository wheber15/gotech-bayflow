import { useState } from "react";
import { Clock3, PackageCheck, Truck } from "lucide-react";
import { Trailer } from "./trailer.types";

type Props = { trailer: Trailer; canOperate: boolean; actorName: string; onUpdate: (id: number, patch: Partial<Trailer>) => void };
const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function TrailerCard({ trailer, canOperate, actorName, onUpdate }: Props) {
  const [showLoadingForm, setShowLoadingForm] = useState(false);
  const [actualPallets, setActualPallets] = useState(String(trailer.actualPallets ?? trailer.plannedPallets));
  const [door, setDoor] = useState(trailer.door ?? "");
  const variance = trailer.actualPallets === undefined ? undefined : trailer.actualPallets - trailer.plannedPallets;

  const confirmLoaded = () => {
    const parsedPallets = Number(actualPallets);
    if (!Number.isFinite(parsedPallets) || parsedPallets < 0) return;
    onUpdate(trailer.id, { status: "LOADED", loadedAt: nowTime(), loadedBy: actorName, actualPallets: parsedPallets, door: door.trim() });
    setShowLoadingForm(false);
  };

  return <article className={`trailerCard trailerCard--${trailer.status.toLowerCase()}`}>
    <div className="cardTop"><div><span className="eyebrow">LOAD {trailer.loadNumber}</span><h3>{trailer.bookedTime}</h3><p className="carrierName">{trailer.carrier}</p></div><span className={`status ${trailer.status.toLowerCase()}`}>{trailer.status.replace("_", " ")}</span></div>
    <div className="trailerMetrics"><span>Planned<b>{trailer.plannedPallets}</b></span><span>Actual<b>{trailer.actualPallets ?? "—"}</b></span><span>Variance<b className={variance ? "varianceText" : ""}>{variance === undefined ? "—" : variance > 0 ? `+${variance}` : variance}</b></span><span>Door<b>{trailer.door || "—"}</b></span></div>
    {variance !== undefined && variance !== 0 && <p className="varianceWarning"><b>Pallet variance:</b> planned {trailer.plannedPallets}, actual {trailer.actualPallets}, variance {variance > 0 ? `+${variance}` : variance}. Loading remains allowed.</p>}
    {canOperate && trailer.status === "BOOKED" && <div className="actions cardActions"><button className="loadedBtn" onClick={() => setShowLoadingForm(true)}><PackageCheck size={18}/>Mark Loaded</button>{!trailer.driverInAt && <button className="optionalAction" onClick={() => onUpdate(trailer.id, { driverInAt: nowTime(), driverInBy: actorName })}><Clock3 size={17}/>Record Driver In</button>}</div>}
    {canOperate && trailer.status === "BOOKED" && showLoadingForm && <div className="loadingForm"><label>Actual pallets<input type="number" min="0" inputMode="numeric" value={actualPallets} onChange={event => setActualPallets(event.target.value)}/></label><label>Door<input value={door} onChange={event => setDoor(event.target.value)} placeholder="Door number"/></label>{Number(actualPallets) !== trailer.plannedPallets && <p className="varianceWarning">Planned {trailer.plannedPallets}; actual {actualPallets || "0"}. You can still complete loading.</p>}<div><button className="secondaryBtn" onClick={() => setShowLoadingForm(false)}>Cancel</button><button className="loadedBtn" disabled={!actualPallets || !Number.isFinite(Number(actualPallets)) || Number(actualPallets) < 0} onClick={confirmLoaded}><PackageCheck size={17}/>Confirm Loaded</button></div></div>}
    {canOperate && trailer.status === "LOADED" && <div className="actions cardActions"><button className="departBtn" onClick={() => onUpdate(trailer.id, { status: "LEFT_SITE", leftSiteAt: nowTime(), leftSiteBy: actorName })}><Truck size={18}/>Mark Left Site</button><span className="actionHint">Physical departure from site</span></div>}
    <div className="timeline"><span>Driver in:<b>{trailer.driverInAt ?? "—"}</b></span><span>Loaded:<b>{trailer.loadedAt ?? "—"}</b></span><span>Left site:<b>{trailer.leftSiteAt ?? "—"}</b></span></div>
  </article>;
}
